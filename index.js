let TracingHandler = require('./tracingHandler');
let id = 'diagnostics';

let tracingHandler;

// TODO: Add js docs

module.exports.id = () => {
    return id;
}

module.exports.init = (taiko) => {
    tracingHandler = new TracingHandler(taiko.client().Tracing, taiko.client().IO);
}

module.exports.startTracing = async () => {
    await tracingHandler.startTracing();
    return { description: 'Browser tracing started' };
}

module.exports.endTracing = async () => {
    await tracingHandler.endTracing();
    return { description: 'Browser tracing ended' };
}

module.exports.getSpeedIndex = async () => {
    return await tracingHandler.getSpeedIndex();
}

module.exports.getTracingLogs = async () => {
    return await tracingHandler.getTracingLogs();
}
