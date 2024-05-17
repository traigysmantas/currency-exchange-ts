import { Module } from '@nestjs/common';
import { QuoteModule } from './quote/quote.module';
import { ExchangeRateModule } from './exchange-rate/exchange-rate.module';
import { ConfigModule } from '@nestjs/config';
import { configValidationSchema } from './commons/schemas/config-validation.schema';

@Module({
  imports: [
    QuoteModule,
    ConfigModule.forRoot({
      validationSchema: configValidationSchema,
      isGlobal: true,
    }),
    ExchangeRateModule,
  ],
})
export class AppModule {}
