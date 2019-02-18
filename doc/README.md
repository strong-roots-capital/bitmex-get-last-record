
bitmex-get-last-record [![Build status](https://travis-ci.org/strong-roots-capital/bitmex-get-last-record.svg?branch=master)](https://travis-ci.org/strong-roots-capital/bitmex-get-last-record) [![npm version](https://img.shields.io/npm/v/@strong-roots-capital/bitmex-get-last-record.svg)](https://npmjs.org/package/@strong-roots-capital/bitmex-get-last-record) [![codecov](https://codecov.io/gh/strong-roots-capital/bitmex-get-last-record/branch/master/graph/badge.svg)](https://codecov.io/gh/strong-roots-capital/bitmex-get-last-record)
=========================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================

> Fetch the most-recent record from BitMEX, allowing for a slight publishing-delay

Tests with the `/trade/bucketed` endpoint show it takes ~15 seconds for BitMEX to publish a candle after session-end. This package abstracts away that (potential) wait with a Promise.

Install
-------

```shell
npm install @strong-roots-capital/bitmex-get-last-record
```

Use
---

```typescript
import bitmexGetLastRecord from '@strong-roots-capital/bitmex-get-last-record'
import Record from 'timeseries-record'

(async () => {
    const record: Record = await bitmexGetLastRecord({symbol: 'XBTUSD', binSize: '1d'})
}) ()
```

Related
-------

*   [timeseries-record](https://github.com/strong-roots-capital/timeseries-record)
*   [is-latest-closed-session](https://github.com/strong-roots-capital/is-latest-closed-session)
*   [bitmex-node](https://www.npmjs.com/package/bitmex-node)
*   [bitmex-realtime-api](https://www.npmjs.com/package/bitmex-realtime-api)

## Index

### Interfaces

* [LastCandleQuery](interfaces/lastcandlequery.md)

### Functions

* [bitmexGetLastRecord](#bitmexgetlastrecord)

---

## Functions

<a id="bitmexgetlastrecord"></a>

###  bitmexGetLastRecord

▸ **bitmexGetLastRecord**(query: *[LastCandleQuery](interfaces/lastcandlequery.md)*): `Promise`<`Record`>

*Defined in [bitmex-get-last-record.ts:50](https://github.com/strong-roots-capital/bitmex-get-last-record/blob/1ee6030/src/bitmex-get-last-record.ts#L50)*

Query the most recently-closed Record from BitMEX exchange.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| query | [LastCandleQuery](interfaces/lastcandlequery.md) |  Parameters defining record to query |

**Returns:** `Promise`<`Record`>
Record of most recently-closed session

___

