import TracingHandler from '../../src/tracingHandler';

test('Start Tracing', async () => {
  jest.setTimeout(30000);
  const mockedTracingStart = jest.fn();
  const mockedTracingIO = jest.fn();
  const mockedTaiko = {
    client: jest.fn(() => ({ Tracing: { start: mockedTracingStart }, IO: { read: mockedTracingIO } }))
  };
  let tracing = new TracingHandler(mockedTaiko.client().Tracing, mockedTaiko.client().IO);
  tracing.startTracing();
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
