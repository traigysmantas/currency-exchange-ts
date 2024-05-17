import { Module } from '@nestjs/common';
import { ExchangeRateService } from './exchange-rate.service';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '../cache/cache.module';
import { SupportedCurrency } from '../commons/enums/supported-currencies.enum';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    HttpModule,
    CacheModule.registerLruTttlCacheAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        maxSize: Object.keys(SupportedCurrency).length - 1,
        ttlInSeconds: configService.get<number>('TTL_IN_SECONDS'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [ExchangeRateService],
  exports: [ExchangeRateService],
})
export class ExchangeRateModule {}
