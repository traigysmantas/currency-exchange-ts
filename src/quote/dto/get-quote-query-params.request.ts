import { IsEnum, IsInt } from 'class-validator';
import { SupportedCurrency } from '../enums/supported-currency.enum';
import { Type } from 'class-transformer';

// TODO: Add validation for same currencies.
export class GetQuoteRequestParams {
  @IsEnum(SupportedCurrency)
  baseCurrency: SupportedCurrency;

  @IsEnum(SupportedCurrency)
  quoteCurrency: SupportedCurrency;

  @IsInt()
  @Type(() => Number)
  baseAmount: number;
}
