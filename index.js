
let Plugin = require('taiko-plugin');
let TracingHandler = require('./tracingHandler');

class Diagnostics extends Plugin {

    init(cri) {
        this.tracingHandler = new TracingHandler(cri.Tracing, cri.IO);
    }

    id() {
        return 'diagnostics';
    }

    async startTracing() {
        await this.tracingHandler.startTracing();
        return { description: 'Browser tracing started' };
    }

    async endTracing() {
        await this.tracingHandler.endTracing();
        return { description: 'Browser tracing ended' };
    }

    async getSpeedIndex() {
        return await this.tracingHandler.getSpeedIndex();
    }

    async getTracingLogs() {
        return await this.tracingHandler.getTracingLogs();
    }
}

module.exports = Diagnostics;