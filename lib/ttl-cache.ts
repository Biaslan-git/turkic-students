export function withTtlCache<T>(loader: () => Promise<T>, ttlMs: number): () => Promise<T> {
  let cache: { value: T; expiresAt: number } | null = null;
  let inflight: Promise<T> | null = null;

  return function getCached(): Promise<T> {
    const now = Date.now();
    if (cache && cache.expiresAt > now) {
      return Promise.resolve(cache.value);
    }
    if (inflight) {
      return inflight;
    }

    inflight = loader()
      .then((value) => {
        cache = { value, expiresAt: Date.now() + ttlMs };
        return value;
      })
      .finally(() => {
        inflight = null;
      });

    return inflight;
  };
}
