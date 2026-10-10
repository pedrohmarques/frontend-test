import { afterEach, describe, expect, it, vi } from 'vitest';
import { api, ApiError } from './api';

// fake fetch Response
function mockResponse(status: number, body: unknown, { jsonFails = false } = {}) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: jsonFails
      ? () => Promise.reject(new SyntaxError('Unexpected token'))
      : () => Promise.resolve(body),
  } as Response;
}

function stubFetch(impl: () => Promise<Response>) {
  const fetchMock = vi.fn(impl);
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('api', () => {
  describe('on success', () => {
    it('returns the parsed JSON body', async () => {
      stubFetch(() => Promise.resolve(mockResponse(200, [{ id: '1', title: 'Post' }])));

      await expect(api('/posts/')).resolves.toEqual([{ id: '1', title: 'Post' }]);
    });

    it('calls the base URL + path and asks for JSON', async () => {
      const fetchMock = stubFetch(() => Promise.resolve(mockResponse(200, [])));

      await api('/posts/');

      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
      expect(url).toMatch(/\/posts\/$/);
      expect(init.headers).toMatchObject({ Accept: 'application/json' });
    });

    it('forwards options like the abort signal and extra headers', async () => {
      const fetchMock = stubFetch(() => Promise.resolve(mockResponse(200, {})));
      const controller = new AbortController();

      await api('/posts/1', {
        signal: controller.signal,
        headers: { 'X-Test': 'yes' },
      });

      const [, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
      expect(init.signal).toBe(controller.signal);
      expect(init.headers).toMatchObject({ Accept: 'application/json', 'X-Test': 'yes' });
    });
  });

  describe('on HTTP errors', () => {
    it('throws ApiError with the status and the API error message (404)', async () => {
      stubFetch(() => Promise.resolve(mockResponse(404, { error: 'post not found' })));

      const error = await api('/posts/missing').catch((e: unknown) => e);

      expect(error).toBeInstanceOf(ApiError);
      expect(error).toMatchObject({ status: 404, message: 'post not found', name: 'ApiError' });
    });

    it('also accepts a "message" field in the error body', async () => {
      stubFetch(() => Promise.resolve(mockResponse(400, { message: 'Bad request' })));

      await expect(api('/posts/')).rejects.toMatchObject({ status: 400, message: 'Bad request' });
    });

    it('uses a fallback message when the error body is not JSON', async () => {
      stubFetch(() => Promise.resolve(mockResponse(500, null, { jsonFails: true })));

      await expect(api('/posts/')).rejects.toMatchObject({
        status: 500,
        message: 'Error on /posts/ (500)',
      });
    });
  });

  describe('on network problems', () => {
    it('turns a network failure into ApiError with status 0', async () => {
      stubFetch(() => Promise.reject(new TypeError('Failed to fetch')));

      await expect(api('/posts/')).rejects.toMatchObject({
        status: 0,
        message: 'Network error. Check your connection.',
      });
    });

    it('rethrows the original error when the request was aborted', async () => {
      const controller = new AbortController();
      controller.abort();
      const abortError = new DOMException('The operation was aborted.', 'AbortError');
      stubFetch(() => Promise.reject(abortError));

      const error = await api('/posts/', { signal: controller.signal }).catch((e: unknown) => e);

      expect(error).toBe(abortError);
      expect(error).not.toBeInstanceOf(ApiError);
    });
  });
});