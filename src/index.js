import TracingHandler from './tracingHandler';
import CSSHandler from './cssHandler';
import LogHandler from './logHandler';
import TaikoDiagEmitter from './TaikoDiagEmitter';

let tracingHandler;
let cssHandler;
let logHandler;
let _taiko, _eventHandler, _descEventHandler;

export function clientHandler(client) {
  const page = client.Page;
  const network = client.Network;
  const log = client.Log;
  const runtime = client.Runtime;
  const css = client.CSS;
  tracingHandler = new TracingHandler(client.Tracing, client.IO);
  cssHandler = new CSSHandler(css, runtime);
  Promise.all([
    page.enable(),
    network.enable(),
    log.enable(),
    runtime.enable()
  ]);
  logHandler = new LogHandler(log.entryAdded, page.loadEventFired, runtime);
}

export function init(taiko, eventHandler, descEventHandler) {
  _taiko = taiko;
  _eventHandler = eventHandler;
  _descEventHandler = descEventHandler;
  _eventHandler.on('createdSession', clientHandler);
}

export async function startTracing() {
  await tracingHandler.startTracing();
  _descEventHandler.emit('success', 'Browser tracing started');
}

export async function endTracing() {
  await tracingHandler.endTracing();
  _descEventHandler.emit('success', 'Browser tracing ended');
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

export async function logConsoleInfo() {
  const emitter = new TaikoDiagEmitter();
  await logHandler.logEntry(emitter);
  return emitter;
}

export async function prettyCSS(coverage) {
  await cssHandler.prettyCss(coverage);
}
