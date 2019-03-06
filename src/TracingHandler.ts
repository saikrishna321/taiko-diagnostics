let speedline = require('speedline');

const DEFAULT_TRACING_CATEGORIES = [
    // Exclude default categories. We'll be selective to minimize trace size
    '-*',

    // Used instead of 'toplevel' in Chrome 71+
    'disabled-by-default-lighthouse',

    // All compile/execute events are captured by parent events in devtools.timeline..
    // But the v8 category provides some nice context for only <0.5% of the trace size
    'v8',
    // Same situation here. This category is there for RunMicrotasks only, but with other teams
    // accidentally excluding microtasks, we don't want to assume a parent event will always exist
    'v8.execute',

    // For extracting UserTiming marks/measures
    'blink.user_timing',

    // Not mandatory but not used much
    'blink.console',

    // Most the events we need come in on these two
    'devtools.timeline',
    'disabled-by-default-devtools.timeline',

    // Up to 450 (https://goo.gl/rBfhn4) JPGs added to the trace
    'disabled-by-default-devtools.screenshot',

    // This doesn't add its own events, but adds a `stackTrace` property to devtools.timeline events
    'disabled-by-default-devtools.timeline.stack',

    // Include screenshots for frame viewer
    'disabled-by-default-devtools.screenshot'
];


export class TracingHandler {
    private readonly _io: any;
    private readonly _tracing: any;
    private _isTracing: boolean;
    traceEvents: any;
    constructor(tracing: any, io: any) {
        this._io = io;
        this._tracing = tracing;
        this._isTracing = false;
    }

    startTracing(categories = DEFAULT_TRACING_CATEGORIES) {
        if (this._isTracing) {
            throw new Error('Browser is already being traced');
        }
        this._isTracing = true;
        this._tracing.start({ categories: categories.join(','), transferMode: 'ReturnAsStream' });
    }

    async endTracing() {
        if (!this._isTracing) {
            throw new Error('No tracing was initiated, initiate `startTracing()` first');
        }
        this._tracing.end();
        this._isTracing = false;
        let fulfill: (value: any) => any;
        this.traceEvents = new Promise(x => fulfill = x);
        await this._tracing.tracingComplete(async (event: { stream: any; }) => {
            await this._readIOStream(event.stream).then(fulfill);
        });
        return await this.traceEvents;
    }

    async getTracingLogs() {
        return await this.traceEvents;
    }

    async getSpeedIndex() {
        const { speedIndex, perceptualSpeedIndex } = await speedline(await this.traceEvents);
        return { speedIndex, perceptualSpeedIndex };
    }

    async _readIOStream(stream: any) {
        let isEOF = false;
        let tracingChunks = '';

        while (!isEOF) {
            const { data, eof } = await this._io.read({ handle: stream });
            tracingChunks += data;

            if (eof) {
                isEOF = true;
                console.log(`finished fetching IO stream with id ${stream}`);
                return JSON.parse(tracingChunks);
            }
        }

    }
}