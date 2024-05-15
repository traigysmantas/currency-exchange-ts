import { Test, TestingModule } from '@nestjs/testing';
import { ExchangeRateService } from './exchange-rate.service';
import { SupportedCurrency } from '../commons/enums/supported-currencies.enum';
import { LruCache } from '../cache/lru-cache';
import { ExchangeRates } from './types/exchange-rates.type';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';

describe(`${ExchangeRateService.name}`, () => {
  let exchangeRateService: ExchangeRateService;
  let cacheService: LruCache<ExchangeRates>;
  let httpService: HttpService;

  const exchangeRates: ExchangeRates = {
    EUR: 1,
    USD: 1.08,
    ILS: 4.01,
    GBP: 0.859,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExchangeRateService,
        {
          provide: HttpService,
          useValue: {
            axiosRef: {
              get: jest.fn(),
            },
          },
        },
        {
          provide: LruCache,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    exchangeRateService = module.get(ExchangeRateService);
    cacheService = module.get(LruCache);
    httpService = module.get(HttpService);
  });

  describe(`${ExchangeRateService.prototype.get.name}`, () => {
    const currencyParams: {
      baseCurrency: SupportedCurrency;
      quoteCurrency: SupportedCurrency;
    } = {
      baseCurrency: SupportedCurrency.EUR,
      quoteCurrency: SupportedCurrency.USD,
    };

    beforeEach(() => {
      jest.spyOn(cacheService, 'get').mockReturnValue(null);
      jest.spyOn(exchangeRateService, 'fetchExchangeRates').mockResolvedValue(exchangeRates);
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    describe('when exchange rates are found in cache', () => {
      it('returns cached exchange rates', async () => {
        jest.spyOn(cacheService, 'get').mockReturnValue(exchangeRates);

        const exchangeRate = await exchangeRateService.get(currencyParams);

        expect(cacheService.get).toHaveBeenCalledWith(SupportedCurrency.EUR);
        expect(cacheService.set).toHaveBeenCalledTimes(0);
        expect(exchangeRateService.fetchExchangeRates).toHaveBeenCalledTimes(0);

        expect(exchangeRate).toBe(1.08);
      });

      it('does not fetch and store new exchange rates', async () => {
        jest.spyOn(cacheService, 'get').mockReturnValue(exchangeRates);

        await exchangeRateService.get(currencyParams);

        expect(cacheService.set).toHaveBeenCalledTimes(0);
        expect(exchangeRateService.fetchExchangeRates).toHaveBeenCalledTimes(0);
      });
    });

    describe('when exchange rates are NOT found in cache', () => {
      it('fetches and returns new exchange rates ', async () => {
        const exchangeRate = await exchangeRateService.get(currencyParams);

        expect(cacheService.get).toHaveBeenCalledWith(SupportedCurrency.EUR);
        expect(exchangeRateService.fetchExchangeRates).toHaveBeenCalledWith(SupportedCurrency.EUR);

        expect(exchangeRate).toBe(1.08);
      });

      it('sets new exchange rates in cache', async () => {
        await exchangeRateService.get(currencyParams);

        expect(cacheService.set).toHaveBeenCalledWith(SupportedCurrency.EUR, exchangeRates);
      });
    });
  });

  describe(`${ExchangeRateService.prototype.fetchExchangeRates.name}`, () => {
    const exchangeRateProviderResponseMock = {
      data: {
        base: 'EUR' as SupportedCurrency,
        time_last_updated: 1715731201,
        rates: {
          USD: 1.08,
          EUR: 1,
          ILS: 4.01,
          GBP: 0.859,
          ISK: 150.5,
          JEP: 0.859,
          JMD: 167.66,
          JOD: 0.767,
          TWD: 34.99,
          TZS: 2794.55,
        },
      },
    };

    beforeEach(() => {
      jest.spyOn(httpService.axiosRef, 'get').mockResolvedValue(exchangeRateProviderResponseMock);
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('returns supported exchange Rates', async () => {
      const result = await exchangeRateService.fetchExchangeRates(SupportedCurrency.EUR);

      expect(result).toStrictEqual({ EUR: 1, GBP: 0.859, ILS: 4.01, USD: 1.08 });
    });

    it('throws error if failed to fetch rates from provider', async () => {
      jest
        .spyOn(httpService.axiosRef, 'get')
        .mockRejectedValue(new AxiosError('currency not found', 'ERR_BAD_REQUEST'));

      const fetchRatePromise = exchangeRateService.fetchExchangeRates(SupportedCurrency.EUR);

      await expect(() => fetchRatePromise).rejects.toThrow(
        'Failed to fetch exchange rates with message: currency not found',
      );
    });

    it('throws error if exchangeRate service does not return rates of all supported currencies', async () => {
      jest.spyOn(httpService.axiosRef, 'get').mockResolvedValue({
        ...exchangeRateProviderResponseMock,
        ...{ data: { rates: { GBP: 0.859, ISK: 150.5, JEP: 0.859 } } },
      });

      const fetchRatePromise = exchangeRateService.fetchExchangeRates(SupportedCurrency.EUR);

      await expect(() => fetchRatePromise).rejects.toThrow('Exchange rate for supported currency: USD not found');
    });
  });
});
