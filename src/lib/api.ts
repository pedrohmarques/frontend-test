const API_URL = import.meta.env.VITE_API_URL ?? 'https://tech-test-backend.dwsbrazil.io';

export class ApiError extends Error {
    readonly status: number;
    constructor(status: number, message: string) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
    }
}

export async function api<T>(path: string, options: RequestInit): Promise<T> {
    let res: Response;
    try {
        res = await fetch(`${API_URL}${path}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });
    } catch (error) {
        if (options.signal?.aborted) throw error;
        throw new ApiError(0, 'Network error. Check your connection.');
    }

    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new ApiError(res.status, body.message ?? `Error on ${path} (${res.status})`);
    } 

    return res.json() as Promise<T>;
}