import { TracingHandler } from './TracingHandler';

export const ID: string = 'diagnostics';

let _tracingHandler: TracingHandler;

export function clientHandler(taiko: { client: { (): { Tracing: any, IO: any; }; }; }) {
    _tracingHandler = new TracingHandler(taiko.client().Tracing, taiko.client().IO);
}

export async function startTracing() {
    await _tracingHandler.startTracing();
    return { description: 'Browser tracing started' };
}

export async function endTracing() {
    await _tracingHandler.endTracing();
    return { description: 'Browser tracing ended' };
}

export async function getSpeedIndex() {
    return await _tracingHandler.getSpeedIndex();
}

export async function getTracingLogs() {
    return await _tracingHandler.getTracingLogs();
}
