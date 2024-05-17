import { Injectable } from '@nestjs/common';
import { GetQuoteRequestParams } from './dto/get-quote-query-params.request';
import { ExchangeRateService } from '../exchange-rate/exchange-rate.service';
import { GetQuoteResponse } from './dto/get-quote.response';
import * as currency from 'currency.js';

@Injectable()
export class QuoteService {
  constructor(private readonly exchangeRateService: ExchangeRateService) {}

  async calculate({ baseAmount, baseCurrency, quoteCurrency }: GetQuoteRequestParams): Promise<GetQuoteResponse> {
    const exchangeRate = await this.exchangeRateService.get({
      baseCurrency,
      quoteCurrency,
    });

    const roundedExchangeRate = currency(exchangeRate, { precision: 3 }).value;

    return {
      exchangeRate: roundedExchangeRate,
      quoteAmount: currency(roundedExchangeRate * baseAmount, { fromCents: true, precision: 0 }).value,
    };
  }
}
