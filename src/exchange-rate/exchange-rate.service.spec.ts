import { Test, TestingModule } from '@nestjs/testing';
import { ExchangeRateService } from './exchange-rate.service';
import { mockDeep } from 'jest-mock-extended';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { AxiosResponse } from 'axios';

describe('ExchangeRateService', () => {
  let exchangeRateService: ExchangeRateService;

  const httpService = mockDeep<HttpService>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExchangeRateService,
        {
          provide: HttpService,
          useValue: httpService,
        },
      ],
    }).compile();

    exchangeRateService = module.get<ExchangeRateService>(ExchangeRateService);
  });

  describe('convertCurrency', () => {
    const response: AxiosResponse<unknown, any> = {
      data: {
        rates: {
          EUR: 0.9,
        },
      },
      headers: {},
      config: { url: 'http://localhost:3000/mockUrl' } as any,
      status: 200,
      statusText: 'OK',
    };

    beforeEach(() => {
      httpService.get.mockReturnValue(of(response));
    });

    it('does not call exchangeRate API if baseCurrency provided as EUR', async () => {
      const convertedData = await exchangeRateService.convertCurrency({
        date: '2020-01-01',
        baseAmount: 100,
        baseCurrency: 'EUR',
      });

      expect(httpService.get).toHaveBeenCalledTimes(0);

      expect(convertedData).toEqual({ amount: 100, currency: 'EUR', exchangeRate: 1 });
    });

    it('calls exchangeRate API if baseCurrency provided as USD', async () => {
      const convertedData = await exchangeRateService.convertCurrency({
        date: '2020-01-01',
        baseAmount: 100,
        baseCurrency: 'USD',
      });

      expect(httpService.get).toHaveBeenCalledWith('https://api.exchangerate.host/2020-01-01', {
        params: { base: 'USD' },
      });
      expect(convertedData).toEqual({ amount: 90, currency: 'EUR', exchangeRate: 0.9 });
    });
  });
});
