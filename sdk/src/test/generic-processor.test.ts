// TODO move out of this package

import { expect } from 'chai'

import { HandlerType } from '..'

import { GenericProcessor } from '../generic-processor'
import { firstCounterValue, TestProcessorServer } from './test-processor-server'

describe('Test Generic Processor', () => {
  const service = new TestProcessorServer()

  beforeAll(async () => {
    service.setup()

    GenericProcessor.bind(
      [
        'event Transfer(address indexed from, address indexed to, uint256 value)',
        'event Approval(address indexed from, address indexed to, uint256 value)',
      ],
      { address: '0x1E4EDE388cbc9F4b5c79681B7f94d36a11ABEBC9' }
    ).onAllEvents(function (log, ctx) {
      ctx.meter.Counter('event_num').add(1)
    })

    await service.start()
  })

  test('check configuration', async () => {
    const config = await service.getConfig({})
    expect(config.contractConfigs).length(1)
    expect(config.contractConfigs?.[0].contract?.name).equals('Generic')
  })

  test('Check log dispatch', async () => {
    const res = await service.testLogs([logData, logData])
    const counters = res.result?.counters
    expect(counters).length(2)
    expect(firstCounterValue(res.result, 'event_num')).equals(1n)
    expect(counters?.[0].runtimeInfo?.from).equals(HandlerType.LOG)
  })

  const logData = {
    blockNumber: 14213252,
    blockHash: '0x83d646fac9350b281def8c4c37626f9d8efc95df801287b848c719edf35cdbaf',
    transactionIndex: 347,
    removed: false,
    address: '0x1E4EDE388cbc9F4b5c79681B7f94d36a11ABEBC9',
    data: '0x00000000000000000000000000000000000000000000009a71db64810aaa0000',
    topics: [
      '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
      '0x0000000000000000000000000000000000000000000000000000000000000000',
      '0x000000000000000000000000b329e39ebefd16f40d38f07643652ce17ca5bac1',
    ],
    transactionHash: '0x93355e0cb2c3490cb8a747029ff2dc8cdbde2407025b8391398436955afae303',
    logIndex: 428,
  }
})