import { DynamicModule, Module, Scope } from '@nestjs/common';
import { LruCache } from './lru-cache';

@Module({})
export class CacheModule {
  static setmaxLRUSize(maxSize: number): DynamicModule {
    return {
      module: CacheModule,
      providers: [
        {
          provide: LruCache,
          useFactory: () => new LruCache(maxSize),
          // it will create new instance each time LruCache is injected in another service
          // this is crucial in order to reuse this class in multiple services and ensure independent cache state
          scope: Scope.TRANSIENT,
        },
      ],
      exports: [LruCache],
    };
  }
}
