/**
 * bitmex-get-last-record
 * Fetch the most-recent record from BitMEX
 */

namespace debug {
    export const timer = require('debug')('bitmexGetLatestCandle:timer')
    export const ws = require('debug')('bitmexGetLatestCandle:websocket')
    export const log = require('debug')('bitmexGetLatestCandle:getLatestCandle')
}


import { utcDate } from '@hamroctopus/utc-date'
import binSizeToTimeframe from '@strong-roots-capital/bin-size-to-timeframe'
import isLatestClosedSession from '@strong-roots-capital/is-latest-closed-session'
import Candle from 'bitmex-candle'
import candleToRecord from 'bitmex-candle-to-record'
import { BitmexAPI } from 'bitmex-node'
import Timer from 'easytimer.js'
import Record from 'timeseries-record'

const BitMEXClient = require('bitmex-realtime-api')

const timer = new Timer()
const bitmex = new BitmexAPI({})

/**
 * Parameters required to query the most-recent candle from BitMEX exchange.
 */
export interface LastCandleQuery {
    /**
     * Instrument symbol. Send a bare series (e.g. XBU) to get data for the nearest expiring contract in that series.
     *
     * You can also send a timeframe, e.g. `XBU:monthly`. Timeframes are `daily`, `weekly`, `monthly`, `quarterly`, and `biquarterly`.
     */
    symbol: string
    /**
     * Time interval to bucket by. Available options: [1m,5m,1h,1d].
     */
    binSize: '1m' | '5m' | '1h' | '1d'
}


/**
 * Query the most recently-closed Record from BitMEX exchange.
 *
 * @param query - Parameters defining record to query
 * @returns Record of most recently-closed session
 */
export default function bitmexGetLastRecord(query: LastCandleQuery): Promise<Record> {

    return new Promise(resolvePromise => {

        let cleanupWebsocket = () => {}

        function resolve(record: Record) {
            cleanupWebsocket()
            resolvePromise(record)
        }

        bitmex.Trade.getBucketed({
            ...query,
            partial: false,
            count: 2,
            reverse: true
        }).then((candles: Candle[]) => {
            const latestClosedRecord = candles
                .map(c => candleToRecord(c, query.binSize))
                .filter(r => isLatestClosedSession(new Date(r.Time), binSizeToTimeframe(query.binSize)))[0]
            debug.log('latestClosedRecord:\n', latestClosedRecord)
            if (latestClosedRecord) {
                debug.log('RESOLVING (REST): ', new Date(latestClosedRecord.Time))
                resolve(latestClosedRecord)
            } else {
                debug.log('(REST): latestClosedRecord not published yet, subscribing to websocket...')

                const websocket = new BitMEXClient()
                cleanupWebsocket = () => websocket.socket.instance.close(1000)


                // DISCUSS: I have an inclination to abstract away all this easy-timer code
                timer.on('started', () => debug.timer('timer.start'))
                timer.on('reset', () => debug.timer('timer.reset'))
                timer.on('targetAchieved', () => {
                    debug.timer('timer.end', utcDate())
                    debug.ws('ping')
                    websocket.socket.send('ping')
                    timer.reset()
                })


                // Note: daily will stop doing that by.. when? by 1300 it's not there (utc)
                websocket.on('error', (...error: string[]) => {
                    if (error.includes('pong')) { return /* no problem here */ }
                    console.error('ws> Error:', ...error)
                })

                websocket.on('end', (code: number) => debug.ws('close: code =', code))

                websocket.on('open', () => {
                    debug.ws('open:', utcDate().toISOString())
                    timer.start({countdown: true, startValues: {seconds: 5}})
                })

                websocket.on('initialize', () => {
                    debug.ws('initialize:', utcDate())
                    websocket.addStream(query.symbol, `tradeBin${query.binSize}`, (candles: Candle[]) => {
                        debug.ws(`ISR (${query.binSize}):`, utcDate())
                        debug.log(candles)
                        timer.reset()
                        const record: Record = candleToRecord(candles[candles.length-1], query.binSize)
                        debug.ws(`ISR (${query.binSize}): currently`, utcDate())
                        debug.ws(`ISR (${query.binSize}): record date`, new Date(record.Time))
                        debug.ws(`ISR (${query.binSize}):\n`, record)
                        debug.ws(`ISR (${query.binSize}): isLatestClosedSession:`, isLatestClosedSession(new Date(record.Time), binSizeToTimeframe(query.binSize)))
                        if (isLatestClosedSession(new Date(record.Time),  binSizeToTimeframe(query.binSize))) {
                            debug.log('RESOLVING (ws): ', new Date(record.Time))
                            resolve(record)
                        }
                    })
                })

                websocket.on('close', () => {
                    debug.ws('close:', utcDate())
                    timer.stop()
                })



            }
        })
    })
}


//  LocalWords:  targetAchieved
