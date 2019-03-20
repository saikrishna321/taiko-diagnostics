import TracingHandler from './tracingHandler';
import CSSHandler from './cssHandler';
import ScreenRecorder from './screenRecorder';

let tracingHandler;
let cssHandler;
let screen;

export const ID  = 'diagnostics'

export function clientHandler(taiko) {
    tracingHandler = new TracingHandler(taiko.client().Tracing, taiko.client().IO);
    cssHandler = new CSSHandler(taiko.client().CSS);
    screen = new ScreenRecorder(taiko.client().Page);
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

export async function startScreenRecord() {
    return await screen.startScreenRecord();
}

export async function stopScreenRecord() {
    return await screen.stopScreenRecord();
}
