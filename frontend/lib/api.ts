export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

export async function fetchJson<T>(path: string): Promise<T> {
  const url = path.startsWith('http')
    ? path
    : `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;

  try {
    const response = await fetch(url, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }

    return (await response.json()) as T;
  } catch (err) {
    if (url.includes(':8000/api')) {
      try {
        const altUrl = url.replace(':8000/api', ':8001/api');
        const altRes = await fetch(altUrl, {
          cache: 'no-store',
          headers: { 'Content-Type': 'application/json' },
        });
        if (altRes.ok) {
          return (await altRes.json()) as T;
        }
      } catch {
        // ignore fallback error
      }
    }
    throw err;
  }
}

export async function postJson<T>(path: string, body: unknown): Promise<T> {
  const url = path.startsWith('http')
    ? path
    : `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`API POST failed with status: ${response.status}`);
    }

    return (await response.json()) as T;
  } catch (err) {
    if (url.includes(':8000/api')) {
      try {
        const altUrl = url.replace(':8000/api', ':8001/api');
        const altRes = await fetch(altUrl, {
          method: 'POST',
          cache: 'no-store',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        if (altRes.ok) {
          return (await altRes.json()) as T;
        }
      } catch {
        // ignore fallback
      }
    }
    throw err;
  }
}

export async function putJson<T>(path: string, body: unknown): Promise<T> {
  const url = path.startsWith('http')
    ? path
    : `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;

  try {
    const response = await fetch(url, {
      method: 'PUT',
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`API PUT failed with status: ${response.status}`);
    }

    return (await response.json()) as T;
  } catch (err) {
    throw err;
  }
}

export async function deleteJson<T>(path: string): Promise<T> {
  const url = path.startsWith('http')
    ? path
    : `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;

  try {
    const response = await fetch(url, {
      method: 'DELETE',
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API DELETE failed with status: ${response.status}`);
    }

    return (await response.json()) as T;
  } catch (err) {
    throw err;
  }
}
