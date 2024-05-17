# Description

Currency exchange service developed in Nestjs, which provides few exchange rate caching algorithms:

- LRU only cache
- LRU + TTL cache

Algorithms are defined in [CacheModule](src/cache/cache.module.ts)

Algorithms can be changed in [ExchangeRateModule](src/exchange-rate/exchange-rate.module.ts)

## Issues with LRU only algorithm and currency exchanges.

Due to the fact that currency exchange rates fluctuate constantly (in 3rd Party exchange provider it changes once a day), it is sub-optimal to use LRU algorithm alone.

It brings up the following issues:

- Cache staleness for actively used currencies.
- Cache size **MUST** be lower than number of supported currencies (keys used in cache). In other case, it will create stale cache for **all** currencies which won't be updated until server is restarted/redeployed.

### Possible alternative approaches

- TTL + LRU cache. Each cache record would have TTL to ensure that stale records are removed and refetched.
- TTL cache only. There are limited amount of currencies returned from API (160 total), thus storing them all won't be an issue

## Setup

### Environment setup

- Create new .env file
- Copy contents of .env.example to .env file

### Installation

```bash
$ npm install
```

### Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```

### Test

```bash
# unit tests
$ npm run test
```
