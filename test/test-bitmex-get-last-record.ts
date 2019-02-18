import test from 'ava'

import * as moment from 'moment'
import Record from 'timeseries-record'
import { utcDate } from '@hamroctopus/utc-date'
import binSizeToTimeframe from '@strong-roots-capital/bin-size-to-timeframe';
import isLatestClosedSession from '@strong-roots-capital/is-latest-closed-session';

const schedule = require('node-schedule')

/**
 * Library under test
 */

import bitmexGetLastRecord from '../src/bitmex-get-last-record'

type BinSize = '1m' | '5m' | '1h' | '1d'

const pullsMostRecentCandle = async (t: any, symbol: string, binSize: BinSize) => {
    t.true(isLatestClosedSession(new Date((await bitmexGetLastRecord({symbol: symbol, binSize: binSize})).Time), binSizeToTimeframe(binSize)))
}
pullsMostRecentCandle.title = (_ = '', symbol: string, binSize: BinSize) => `should resolve most-recent ${binSizeToTimeframe(binSize)} ${symbol} candle`

test(pullsMostRecentCandle, 'XBTUSD', '1m')
test(pullsMostRecentCandle, 'XBTUSD', '5m')
test(pullsMostRecentCandle, 'XBTUSD', '1h')
test(pullsMostRecentCandle, 'XBTUSD', '1d')

// test that pullsMostRecentCandle via websocket
test.cb('should resolve with websockets when querying records not-yet published', t => {
    const nextMinute = moment.utc().add(1, 'minute').startOf('minute').toDate()
    console.log(new Date().toISOString(), ' > current time')
    console.log(nextMinute.toISOString(), ' > start of next test')
    schedule.scheduleJob(nextMinute, async () => {
        console.log(new Date().toISOString(), ' > beginning scheduled test')
        t.true(isLatestClosedSession(new Date((await bitmexGetLastRecord({symbol: 'XBTUSD', binSize: '1m'})).Time), binSizeToTimeframe('1m')))
        t.end()
    })
})
