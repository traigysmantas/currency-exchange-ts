import { DynamicModule, Module } from '@nestjs/common';
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
        },
      ],
      exports: [LruCache],
    };
  }
}
