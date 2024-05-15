import { Module } from '@nestjs/common';
import { ExchangeRateService } from './exchange-rate.service';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '../cache/cache.module';
import { SupportedCurrency } from '../commons/enums/supported-currencies.enum';

@Module({
  imports: [
    HttpModule,
    /**
     *  If LRU cache size is bigger than number of SupportedCurrency keys,
     *  after 24 hours cache turns stale and all cached exchanged rates will be invalid.
     * Even
     */
    CacheModule.setmaxLRUSize(Object.keys(SupportedCurrency).length - 1),
  ],
  providers: [ExchangeRateService],
  exports: [ExchangeRateService],
})
export class ExchangeRateModule {}
