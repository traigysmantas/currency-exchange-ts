import { DynamicModule, Module, Scope } from '@nestjs/common';
import { LruCache } from './lru-cache';
import { LruTtlCache } from './lru-ttl-cache';
import { MEMORY_CACHE } from './cache.interface';
import { TtlCacheParams } from './types/ttl-cache-params.type';

@Module({})
export class CacheModule {
  static registerLruCache(maxSize: number): DynamicModule {
    return {
      module: CacheModule,
      providers: [
        {
          provide: MEMORY_CACHE,
          useFactory: () => new LruCache(maxSize),
          // it will create new instance each time LruCache is injected in another service
          // this is crucial in order to reuse this class in multiple services and ensure independent cache state
          scope: Scope.TRANSIENT,
        },
      ],
      exports: [MEMORY_CACHE],
    };
  }

  static registerLruTttlCache({ maxSize, ttlInSeconds }: TtlCacheParams): DynamicModule {
    return {
      module: CacheModule,
      providers: [
        {
          provide: MEMORY_CACHE,
          useFactory: () => new LruTtlCache(maxSize, ttlInSeconds),
          scope: Scope.TRANSIENT,
        },
      ],
      exports: [MEMORY_CACHE],
    };
  }

  static registerLruTttlCacheAsync(options: {
    imports: any[];
    useFactory: (...args: any[]) => Promise<TtlCacheParams> | TtlCacheParams;
    inject: any[];
  }): DynamicModule {
    return {
      module: CacheModule,
      imports: options.imports,
      providers: [
        {
          provide: MEMORY_CACHE,
          useFactory: async (...args: any[]) => {
            const { maxSize, ttlInSeconds } = await options.useFactory(...args);
            return new LruTtlCache(maxSize, ttlInSeconds);
          },
          inject: options.inject,
          scope: Scope.TRANSIENT,
        },
      ],
      exports: [MEMORY_CACHE],
    };
  }
}
