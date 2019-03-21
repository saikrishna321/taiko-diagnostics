import TracingHandler from './tracingHandler';
import CSSHandler from './cssHandler';
import LogHandler from './logHandler';

let tracingHandler;
let cssHandler;
let logHandler;

export const ID  = 'diagnostics'

export function clientHandler(taiko) {
    tracingHandler = new TracingHandler(taiko.client().Tracing, taiko.client().IO);
    cssHandler = new CSSHandler(taiko.client().CSS);
    logHandler = new LogHandler(taiko.client().Page, taiko.client().Network, taiko.client().Log);
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

export async function startCssTracing() {
    return await cssHandler.startCssTracking();
}

export async function stopCssTracing() {
    return await cssHandler.stopCssTracking();
}

export async function getCssCoverage() {
    return await cssHandler.getCssCoverage();
}

export function logConsoleInfo() {
    return logHandler.logEntry();
}
