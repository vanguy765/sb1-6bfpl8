import NodeCache from 'node-cache';

export class CacheService {
  private cache: NodeCache;

  constructor(ttlSeconds: number = 3600) {
    this.cache = new NodeCache({
      stdTTL: ttlSeconds,
      checkperiod: ttlSeconds * 0.2,
    });
  }

  async get<T>(key: string): Promise<{ data: T | null; fromCache: boolean }> {
    const value = this.cache.get<T>(key);
    return {
      data: value || null,
      fromCache: value !== undefined
    };
  }

  async set<T>(key: string, value: T): Promise<void> {
    this.cache.set(key, value);
  }

  async delete(key: string): Promise<void> {
    this.cache.del(key);
  }
}

export const cacheService = new CacheService();