import { Test, TestingModule } from '@nestjs/testing';
import { QuoteService } from './quote.service';
import { ExchangeRateService } from '../exchange-rate/exchange-rate.service';
import { SupportedCurrency } from '../commons/enums/supported-currencies.enum';
import { GetQuoteRequestParams } from './dto/get-quote-query-params.request';

describe('QuoteService', () => {
  let quoteService: QuoteService;
  let exchangeRateService: ExchangeRateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuoteService,
        {
          provide: ExchangeRateService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    quoteService = module.get(QuoteService);
    exchangeRateService = module.get(ExchangeRateService);
  });

  describe(`${QuoteService.prototype.calculate.name}`, () => {
    const params: GetQuoteRequestParams = {
      baseAmount: 100,
      baseCurrency: SupportedCurrency.EUR,
      quoteCurrency: SupportedCurrency.USD,
    };

    beforeEach(() => {
      jest.spyOn(exchangeRateService, 'get').mockResolvedValue(1.08);
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('calls exchangeRateService.get with baseCurrency and quoteCurrency', async () => {
      await quoteService.calculate(params);

      expect(exchangeRateService.get).toHaveBeenCalledWith({
        baseCurrency: SupportedCurrency.EUR,
        quoteCurrency: SupportedCurrency.USD,
      });
    });

    it('returns exchangeRate and rounded quoteAmount (in cents) to nearest integer', async () => {
      const result = await quoteService.calculate({ ...params, baseAmount: 125312 });

      expect(result).toStrictEqual({
        exchangeRate: 1.08,
        quoteAmount: 135337,
      });
    });
  });
});
