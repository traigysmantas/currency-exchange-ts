import { Module } from '@nestjs/common';
import { LruCache } from './lru-cache';

@Module({
  providers: [LruCache],
  exports: [LruCache],
})
export class CacheModule {}
