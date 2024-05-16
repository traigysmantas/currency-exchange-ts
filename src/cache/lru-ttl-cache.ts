import { Injectable } from '@nestjs/common';
import { MemoryCache } from './cache.interface';
import { add, isAfter } from 'date-fns';

@Injectable()
export class LruTtlCache<T> implements MemoryCache<T> {
  private cache: Map<string, { value: T; expireAt: string }>;
  private maxSize: number;
  private ttlInSeconds: number;

  constructor(maxSize: number, ttlInSeconds: number) {
    this.maxSize = maxSize;
    this.ttlInSeconds = ttlInSeconds;
    this.cache = new Map<string, { value: T; expireAt: string }>();
  }

  private setExpireAt(): string {
    return add(new Date(), { seconds: this.ttlInSeconds }).toISOString();
  }

  private isExpired(expireAt: string): boolean {
    return isAfter(new Date(), new Date(expireAt));
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    if (this.isExpired(entry.expireAt)) {
      this.cache.delete(key);
      return null;
    }

    // re-arrange latest (last) used key.
    this.cache.delete(key);
    this.cache.set(key, entry);

    return entry.value;
  }

  set(key: string, value: T): void {
    if (this.cache.size >= this.maxSize) {
      // Remove oldest key (first) key from cache map.
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, { value, expireAt: this.setExpireAt() });
  }

  keys() {
    return this.cache.keys();
  }

  clear() {
    return this.cache.clear();
  }
}
