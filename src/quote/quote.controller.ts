import { Controller, Get, Query } from '@nestjs/common';
import { QuoteService } from './quote.service';
import { GetQuoteRequestParams } from './dto/get-quote-query-params.request';
import { GetQuoteResponse } from './dto/get-quote.response';

@Controller('quote')
export class QuoteController {
  constructor(private quoteService: QuoteService) {}

  @Get()
  getQuote(
    @Query() { baseAmount, baseCurrency, quoteCurrency }: GetQuoteRequestParams,
  ): Promise<GetQuoteResponse> {
    return this.quoteService.calculateQuote({
      baseAmount,
      baseCurrency,
      quoteCurrency,
    });
  }
}
