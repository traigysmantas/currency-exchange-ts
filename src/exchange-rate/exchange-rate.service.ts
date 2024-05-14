import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { GetExchangeRateResponse } from './dto/get-exchange-rate-response.dto';
import { SupportedCurrency } from '../quote/enums/supported-currency.enum';

@Injectable()
export class ExchangeRateService {
  constructor(private readonly httpService: HttpService) {}

  private async fetchExchangeRates({
    baseCurrency,
  }: {
    baseCurrency: SupportedCurrency;
  }): Promise<GetExchangeRateResponse> {
    const { data } = await firstValueFrom(
      this.httpService
        .get<GetExchangeRateResponse>(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`, {
          params: {
            base: baseCurrency,
          },
        })
        .pipe(
          catchError((err: AxiosError) => {
            throw err;
          }),
        ),
    );

    return {
      ...data,
      rates: this.mapSupportedCurrency(data.rates),
    };
  }

  private mapSupportedCurrency(rates: GetExchangeRateResponse['rates']): GetExchangeRateResponse['rates'] {
    return Object.values(SupportedCurrency).reduce((supportedCurrencyRates, currency) => {
      return { ...supportedCurrencyRates, [currency]: rates[currency] };
    }, {});
  }

  async getExchangeRates({
    baseCurrency,
    quoteCurrency,
  }: {
    baseCurrency: SupportedCurrency;
    quoteCurrency: SupportedCurrency;
  }): Promise<GetExchangeRateResponse> {
    const exchangeRates = await this.fetchExchangeRates({ baseCurrency });

    return exchangeRates;
  }
}
