const formatter = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
  
  export function formatDate(iso: string): string {
    return formatter.format(new Date(iso));
  }