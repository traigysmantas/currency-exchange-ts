## Description

Currency exchange rate service which uses implemented LRU Cache algorithm.

Application is implemented using NestJs framework.

## Issues with algorithm and currency exchanges.

Due to the fact that currency exchange rates fluctuate constantly (in 3rd Party exchange provider it changes once a day), it is sub-optimal to use LRU algorithm alone.

It raises following issues:

- Cache staleness for actively used currencies. They
- Cache size MUST be lower than number of (supported) currencies. In other case, it will create stale cache for **all** currencies which won't be updated until server is restarted/redeployed.

### Possible alternative approaches

- TTL + LRU cache. Each cache record would have TTL to ensure that stale records are removed and refetched.
- TTL cache only. There are limited amount of currencies returned from API (160 total). Each can be saved in memory with set TTL. At maximum, it might allocate up to 400 KB.

```
(160 [number of currencies] * 160 (records of currencies in response) * 16 bytes (6 bytes for key and max 10 bytes for value)) / 1024 = 400 KB
```

Calculation

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
