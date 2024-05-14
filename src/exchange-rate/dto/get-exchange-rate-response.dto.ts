import { SupportedCurrency } from '../../quote/enums/supported-currency.enum';

export class GetExchangeRateResponse {
  base: SupportedCurrency;

  /** ISO format date: YYYY-MM-DD */
  date: string;

  /** date timestamp */
  time_last_updated: number;

  rates: {
    [key: string | SupportedCurrency]: number;
  };
}
