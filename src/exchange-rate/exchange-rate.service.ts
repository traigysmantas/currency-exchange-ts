import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { FetchExchangeRateResponse } from './dto/fetch-exchange-rate-response.dto';
import { SupportedCurrency } from '../commons/enums/supported-currencies.enum';
import { ExchangeRates } from './types/exchange-rates.type';
import { AxiosError } from 'axios';
import { MEMORY_CACHE, MemoryCache } from '../cache/cache.interface';

@Injectable()
export class ExchangeRateService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(MEMORY_CACHE) private readonly cacheService: MemoryCache<ExchangeRates>,
  ) {}

  async fetchExchangeRates(baseCurrency: SupportedCurrency): Promise<ExchangeRates> {
    try {
      const { data: ratesResponse } = await this.httpService.axiosRef.get<FetchExchangeRateResponse>(
        `https://api.exchangerate-api.com/v4/latest/${baseCurrency}`,
      );

      return this.mapSupportedCurrency(ratesResponse.rates);
    } catch (err) {
      if (err instanceof AxiosError) {
        throw new Error(`Failed to fetch exchange rates with message: ${err.message}`);
      }

      throw err;
    }
  }

  private mapSupportedCurrency(rates: FetchExchangeRateResponse['rates']): ExchangeRates {
    return Object.values(SupportedCurrency).reduce((supportedCurrencyRates, currency) => {
      const exchangeRate = rates[currency];

      if (!exchangeRate) throw new Error(`Exchange rate for supported currency: ${currency} not found`);

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

    const exchangeRates = await this.fetchExchangeRates(baseCurrency);
    this.cacheService.set(baseCurrency, exchangeRates);

    return exchangeRates[quoteCurrency];
  }
}
