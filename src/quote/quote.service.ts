import { Injectable, Query } from '@nestjs/common';
import { GetQuoteRequestParams } from './dto/get-quote-query-params.request';
import { ExchangeRateService } from '../exchange-rate/exchange-rate.service';
import { GetQuoteResponse } from './dto/get-quote.response';

@Injectable()
export class QuoteService {
  constructor(private readonly exchangeRateService: ExchangeRateService) {}

  async calculateQuote({ baseAmount, baseCurrency, quoteCurrency }: GetQuoteRequestParams): Promise<GetQuoteResponse> {
    // TODO: call 3rd party service
    const exchangeRate = await this.exchangeRateService.getExchangeRates({
      baseCurrency,
      quoteCurrency,
    });

    return {
      exchangeRate: exchangeRate.rates[quoteCurrency],
      quoteAmount: exchangeRate.rates[quoteCurrency] * baseAmount,
    };
  }
}
