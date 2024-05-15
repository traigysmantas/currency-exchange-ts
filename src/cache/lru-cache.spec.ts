import { Test, TestingModule } from '@nestjs/testing';
import { LruCache } from './lru-cache';

describe(`${LruCache.name}`, () => {
  let lruCache: LruCache<number>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: LruCache,
          useFactory: () => new LruCache<number>(3),
        },
      ],
    }).compile();

    lruCache = module.get<LruCache<number>>(LruCache);
  });

  describe(`${LruCache.prototype.get.name}`, () => {
    beforeEach(() => {
      lruCache.clear();
    });

    it('returns null if cache value not found by key', () => {
      const key = lruCache.get('not-found-key');

      expect(key).toBeNull();
    });

    it('returns found cache value', () => {
      const key = 'one';
      lruCache.set(key, 1);

      const result = lruCache.get(key);

      expect(result).toBe(1);
    });

    it('rearranges least recently used key to be the latest', () => {
      lruCache.set('one', 1);
      lruCache.set('two', 2);
      lruCache.set('three', 3);
      lruCache.set('one', 1);

      lruCache.get('one');

      const cacheKeys = [...lruCache.keys()];

      expect(cacheKeys).toStrictEqual(['two', 'three', 'one']);
    });
  });

  describe(`${LruCache.prototype.set.name}`, () => {
    beforeEach(() => {
      lruCache.clear();
    });

    it('sets new value to cache', () => {
      lruCache.set('one', 1);

      const key = lruCache.get('one');

      expect(key).toBe(1);
    });

    it('removes oldest used key from cache map when cache is full', () => {
      lruCache.set('one', 1);
      lruCache.set('two', 2);
      lruCache.set('three', 3);
      lruCache.set('four', 4);

      expect(lruCache.get('one')).toBeNull();
    });
  });
});
