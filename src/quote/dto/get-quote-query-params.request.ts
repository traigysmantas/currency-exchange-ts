import { IsEnum, IsInt } from 'class-validator';
import { SupportedCurrency } from '../enums/supported-currencies.enum';
import { Type } from 'class-transformer';

export class GetQuoteRequestParams {
  @IsEnum(SupportedCurrency)
  baseCurrency: SupportedCurrency;

  @IsEnum(SupportedCurrency)
  quoteCurrency: SupportedCurrency;

  @IsInt()
  @Type(() => Number)
  baseAmount: number;
}
