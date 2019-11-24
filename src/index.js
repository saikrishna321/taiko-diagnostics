import TracingHandler from './tracingHandler';
import CSSHandler from './cssHandler';
import LogHandler from './logHandler';
import TaikoDiagEmitter from './TaikoDiagEmitter';
import lighthouse from 'lighthouse';
const ReportGenerator = require('lighthouse/lighthouse-core/report/report-generator');
import fs from 'fs';

let tracingHandler;
let cssHandler;
let logHandler;
let _taiko, _eventHandler, _descEventHandler;
let host;
let port;
let reportLH = [];

export function clientHandler(client) {
  const wsDedebug = client.webSocketUrl
    .split('/devtools/')[0]
    .replace('ws://', '')
    .split(':');
  host = wsDedebug[0];
  port = wsDedebug[1];
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

export async function getLh() {
  const lhData = await lighthouse('https://google.com', {
    port,
    hostname: host
  });
  console.log(lhData);
}

export async function getLHResults() {
  await Promise.all(reportLH.map(b => console.log('----', b)));
}
