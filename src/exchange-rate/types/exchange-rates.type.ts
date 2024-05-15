import { SupportedCurrency } from '../../commons/enums/supported-currencies.enum';

export type ExchangeRates = {
  [key in keyof typeof SupportedCurrency]: number;
};
