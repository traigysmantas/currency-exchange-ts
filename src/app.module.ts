import { Module } from '@nestjs/common';
import { QuoteModule } from './quote/quote.module';
import { ExchangeRateModule } from './exchange-rate/exchange-rate.module';

@Module({
  imports: [QuoteModule, ExchangeRateModule],
})
export class AppModule {}
