import { Injectable } from '@nestjs/common';
import { GetQuoteRequestParams } from './dto/get-quote-query-params.request';
import { ExchangeRateService } from '../exchange-rate/exchange-rate.service';
import { GetQuoteResponse } from './dto/get-quote.response';

@Injectable()
export class QuoteService {
  constructor(private readonly exchangeRateService: ExchangeRateService) {}

  async calculate({ baseAmount, baseCurrency, quoteCurrency }: GetQuoteRequestParams): Promise<GetQuoteResponse> {
    const exchangeRate = await this.exchangeRateService.get({
      baseCurrency,
      quoteCurrency,
    });

    return {
      exchangeRate: exchangeRate,
      quoteAmount: Math.round(exchangeRate * baseAmount),
    };
  }
}
