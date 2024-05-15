import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { FetchExchangeRateResponse } from './dto/fetch-exchange-rate-response.dto';
import { SupportedCurrency } from '../commons/enums/supported-currencies.enum';
import { LruCache } from '../cache/lru-cache';
import { ExchangeRates } from './types/exchange-rates.type';

@Injectable()
export class ExchangeRateService {
  constructor(
    private readonly httpService: HttpService,
    private readonly cacheService: LruCache<ExchangeRates>,
  ) {}

  private async fetchExchangeRates({ baseCurrency }: { baseCurrency: SupportedCurrency }): Promise<ExchangeRates> {
    try {
      const { data: ratesResponse } = await this.httpService.axiosRef.get<FetchExchangeRateResponse>(
        `https://api.exchangerate-api.com/v4/latest/${baseCurrency}`,
        {
          params: {
            base: baseCurrency,
          },
        },
      );

      return this.mapSupportedCurrency(ratesResponse.rates);
    } catch (err) {
      throw new Error('Failed to fetch exchange rates');
    }
  }

  private mapSupportedCurrency(rates: FetchExchangeRateResponse['rates']): ExchangeRates {
    return Object.values(SupportedCurrency).reduce((supportedCurrencyRates, currency) => {
      const exchangeRate = rates[currency];

      if (!exchangeRate) throw new Error(`Unsupported exchange rate for currency: ${currency}`);

      return { ...supportedCurrencyRates, [currency]: exchangeRate };
    }, {} as ExchangeRates);
  }

  async get({
    baseCurrency,
    quoteCurrency,
  }: {
    baseCurrency: SupportedCurrency;
    quoteCurrency: SupportedCurrency;
  }): Promise<number> {
    const cachedExchangeRates = this.cacheService.get(baseCurrency);

    if (cachedExchangeRates) {
      return cachedExchangeRates[quoteCurrency];
    }

    const exchangeRates = await this.fetchExchangeRates({ baseCurrency });
    this.cacheService.set(baseCurrency, exchangeRates);

    return exchangeRates[quoteCurrency];
  }
}
