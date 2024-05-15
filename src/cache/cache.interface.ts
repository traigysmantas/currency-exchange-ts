export interface MemoryCache<T> {
  get(key: string): T;
  set(key: string, value: T): void;
}
