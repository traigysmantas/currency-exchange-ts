import { SupportedCurrency } from '../../commons/enums/supported-currencies.enum';

export class FetchExchangeRateResponse {
  base: string | SupportedCurrency;

  /** ISO format date: YYYY-MM-DD */
  date: string;

  /** date timestamp */
  time_last_updated: number;

  rates: {
    [key: string | SupportedCurrency]: number;
  };
}
