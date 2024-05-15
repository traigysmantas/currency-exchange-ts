import { Injectable } from '@nestjs/common';

@Injectable()
export class LruCache<T> {
  private cache: Map<string, T>;
  private maxSize: number;

  constructor(maxSize: number) {
    this.maxSize = maxSize;
    this.cache = new Map<string, T>();
  }

  get(key: string): T {
    const item = this.cache.get(key);

    if (item) {
      // re-arrange latest (last) used key.
      this.cache.delete(key);
      this.cache.set(key, item);

      return item;
    }
  }

  set(key: string, value: T): void {
    if (this.cache.size >= this.maxSize) {
      // Remove oldestKey (first) key of cache map.
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, value);
  }
}
