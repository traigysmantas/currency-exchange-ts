import { Injectable } from '@nestjs/common';
import { MemoryCache } from './cache.interface';

@Injectable()
export class LruCache<T> implements MemoryCache<T> {
  private cache: Map<string, T>;
  private maxSize: number;

  constructor(maxSize: number) {
    this.maxSize = maxSize;
    this.cache = new Map<string, T>();
  }

  get(key: string): T | null {
    const item = this.cache.get(key);

    if (item) {
      // re-arrange latest (last) used key.
      this.cache.delete(key);
      this.cache.set(key, item);

      return item;
    }

    return null;
  }

  set(key: string, value: T): void {
    if (this.cache.size >= this.maxSize) {
      // Remove oldest key (first) key from cache map.
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, value);
  }

  keys() {
    return this.cache.keys();
  }

  clear() {
    return this.cache.clear();
  }
}
