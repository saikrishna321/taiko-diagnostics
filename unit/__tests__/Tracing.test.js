import TracingHandler from '../../src/tracingHandler';
import tracingEvents from '../__fixtures__/tracingEvents.json'
test('Start Tracing', async () => {
    jest.setTimeout(30000);
    const mockedTracingStart = jest.fn();
    const mockedTracingIO = jest.fn();
    const mockedTaiko = {
        client: jest.fn(() => ({ Tracing: { start: mockedTracingStart }, IO: { read: mockedTracingIO } }))
    };
    let tracing = new TracingHandler(mockedTaiko.client().Tracing, mockedTaiko.client().IO);
    await tracing.startTracing();
    expect(await tracing.isTracing).toBe(true);
    expect(mockedTracingStart).toHaveBeenCalled();
});

test('End tracing throws if not tracing', async () => {
    const mockedTracingStart = jest.fn();
    const mockedTracingIO = jest.fn();
    const mockedTaiko = {
        client: jest.fn(() => ({ Tracing: { start: mockedTracingStart }, IO: { read: mockedTracingIO } }))
    };
    let tracing = new TracingHandler(mockedTaiko.client().Tracing, mockedTaiko.client().IO);
    try {
        await tracing.endTracing();
    } catch (err) {
        expect(err.message).toEqual('No tracing was initiated, initiate `startTracing()` first');
    }
})

test('getTracingLogs', async () => {
    const mockedTracingStart = jest.fn();
    const mockedTracingIO = jest.fn();
    const mockedTaiko = {
        client: jest.fn(() => ({ Tracing: { start: mockedTracingStart }, IO: { read: mockedTracingIO } }))
    };
    let tracing = new TracingHandler(mockedTaiko.client().Tracing, mockedTaiko.client().IO);
    tracing.traceEvents = 'foobar';
    expect(await tracing.getTracingLogs()).toEqual('foobar');
})

test('get speed index', async () => {
    const mockedTracingStart = jest.fn();
    const mockedTracingIO = jest.fn();
    const mockedTaiko = {
        client: jest.fn(() => ({ Tracing: { start: mockedTracingStart }, IO: { read: mockedTracingIO } }))
    };
    let tracing = new TracingHandler(mockedTaiko.client().Tracing, mockedTaiko.client().IO);
    tracing.traceEvents = tracingEvents;
    const speedIndex = await tracing.getSpeedIndex();
    expect(speedIndex).toEqual({ speedIndex: 735.2189999735356, perceptualSpeedIndex: 832.5956931637686 })
})
