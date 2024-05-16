import { Module } from '@nestjs/common';
import { ExchangeRateService } from './exchange-rate.service';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '../cache/cache.module';
import { SupportedCurrency } from '../commons/enums/supported-currencies.enum';

@Module({
  imports: [
    HttpModule,
    // CacheModule.registerLruCache(Object.keys(SupportedCurrency).length - 1),
    CacheModule.registerLruTttlCache({ maxSize: Object.keys(SupportedCurrency).length - 1, ttlInSeconds: 60 }),
  ],
  providers: [ExchangeRateService],
  exports: [ExchangeRateService],
})
export class ExchangeRateModule {}
