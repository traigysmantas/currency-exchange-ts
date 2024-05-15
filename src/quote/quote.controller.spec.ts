import { Test, TestingModule } from '@nestjs/testing';
import { QuoteController } from './quote.controller';
import { QuoteService } from './quote.service';
import { GetQuoteRequestParams } from './dto/get-quote-query-params.request';
import { SupportedCurrency } from '../commons/enums/supported-currencies.enum';

describe(`${QuoteController.name}`, () => {
  let controller: QuoteController;
  let quoteService: QuoteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuoteController],
      providers: [
        {
          provide: QuoteService,
          useValue: {
            calculate: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<QuoteController>(QuoteController);
    quoteService = module.get(QuoteService);
  });

  describe(`${QuoteController.prototype.getQuote.name}`, () => {
    const params: GetQuoteRequestParams = {
      baseAmount: 100,
      baseCurrency: SupportedCurrency.EUR,
      quoteCurrency: SupportedCurrency.USD,
    };

    beforeEach(() => {
      jest.spyOn(quoteService, 'calculate').mockResolvedValue({
        exchangeRate: 1.08,
        quoteAmount: 108,
      });
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('calls quoteService.calculate with baseAmount, baseCurrency and quoteCurrency', async () => {
      controller.getQuote(params);

      expect(quoteService.calculate).toHaveBeenCalledWith({
        baseAmount: 100,
        baseCurrency: SupportedCurrency.EUR,
        quoteCurrency: SupportedCurrency.USD,
      });
    });

    it('returns calculated quote', async () => {
      const result = await controller.getQuote(params);

      expect(result).toStrictEqual({
        exchangeRate: 1.08,
        quoteAmount: 108,
      });
    });
  });
});
