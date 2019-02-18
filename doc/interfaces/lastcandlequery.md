[bitmex-get-last-record](../README.md) > [LastCandleQuery](../interfaces/lastcandlequery.md)

# Interface: LastCandleQuery

Parameters required to query the most-recent candle from BitMEX exchange.

## Hierarchy

**LastCandleQuery**

## Index

### Properties

* [binSize](lastcandlequery.md#binsize)
* [symbol](lastcandlequery.md#symbol)

---

## Properties

<a id="binsize"></a>

###  binSize

**● binSize**: *"1m" \| "5m" \| "1h" \| "1d"*

*Defined in [bitmex-get-last-record.ts:40](https://github.com/strong-roots-capital/bitmex-get-last-record/blob/7e6ed66/src/bitmex-get-last-record.ts#L40)*

Time interval to bucket by. Available options: \[1m,5m,1h,1d\].

___
<a id="symbol"></a>

###  symbol

**● symbol**: *`string`*

*Defined in [bitmex-get-last-record.ts:36](https://github.com/strong-roots-capital/bitmex-get-last-record/blob/7e6ed66/src/bitmex-get-last-record.ts#L36)*

Instrument symbol. Send a bare series (e.g. XBU) to get data for the nearest expiring contract in that series.

You can also send a timeframe, e.g. `XBU:monthly`. Timeframes are `daily`, `weekly`, `monthly`, `quarterly`, and `biquarterly`.

___

