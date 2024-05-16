import { Test, TestingModule } from '@nestjs/testing';
import { LruTtlCache } from './lru-ttl-cache';

describe(`${LruTtlCache.name}`, () => {
  let lruTtlCache: LruTtlCache<number>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: LruTtlCache,
          useFactory: () => new LruTtlCache<number>(3, 15),
        },
      ],
    }).compile();

    lruTtlCache = module.get<LruTtlCache<number>>(LruTtlCache);
  });

  describe(`${LruTtlCache.prototype.get.name}`, () => {
    beforeEach(() => {
      lruTtlCache.clear();
    });

    it('returns null if cache value not found by key', () => {
      const key = lruTtlCache.get('not-found-key');

      expect(key).toBeNull();
    });

    it('returns found cache value', () => {
      const key = 'one';
      lruTtlCache.set(key, 1);

      const result = lruTtlCache.get(key);

      expect(result).toBe(1);
    });

    it('rearranges least recently used key to be the latest', () => {
      lruTtlCache.set('one', 1);
      lruTtlCache.set('two', 2);
      lruTtlCache.set('three', 3);
      lruTtlCache.set('one', 1);

      lruTtlCache.get('one');

      const cacheKeys = [...lruTtlCache.keys()];

      expect(cacheKeys).toStrictEqual(['two', 'three', 'one']);
    });

    it('returns null if key is expired', () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-05-14'));
      lruTtlCache.set('one', 1);

      jest.useRealTimers();

      const result = lruTtlCache.get('one');

      expect(result).toBeNull();
    });
  });

  describe(`${LruTtlCache.prototype.set.name}`, () => {
    beforeEach(() => {
      lruTtlCache.clear();
    });

    it('sets new value to cache', () => {
      lruTtlCache.set('one', 1);

      const key = lruTtlCache.get('one');

      expect(key).toBe(1);
    });

    it('removes oldest used key from cache map when cache is full', () => {
      lruTtlCache.set('one', 1);
      lruTtlCache.set('two', 2);
      lruTtlCache.set('three', 3);
      lruTtlCache.set('four', 4);

      expect(lruTtlCache.get('one')).toBeNull();
    });
  });
});
