import { SupportedCurrency } from '../../quote/enums/supported-currencies.enum';

export class FetchExchangeRateResponse {
  base: SupportedCurrency;

  /** ISO format date: YYYY-MM-DD */
  date: string;

  /** date timestamp */
  time_last_updated: number;

  rates: {
    [key: string | SupportedCurrency]: number;
  };
}
