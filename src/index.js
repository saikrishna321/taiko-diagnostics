import TracingHandler from './tracingHandler';

let tracingHandler;

export const ID  = 'diagnostics'

export function clientHandler(taiko) {
    tracingHandler = new TracingHandler(taiko.client().Tracing, taiko.client().IO);
}

export async function startTracing() {
    await tracingHandler.startTracing();
    return { description: 'Browser tracing started' };
}

export async function endTracing() {
    await tracingHandler.endTracing();
    return { description: 'Browser tracing ended' };
}

export async function getSpeedIndex() {
    return await tracingHandler.getSpeedIndex();
}

export async function getTracingLogs() {
    return await tracingHandler.getTracingLogs();
}

export async function getPerformanceMetrics() {
    return await tracingHandler.getPerformanceMetrics();
}
