import speedline from 'speedline';
import TraceOfTab from './lighthouse/tabTracing';
import FirstInteractiveAudit from './lighthouse/firstInteractive';
import { DEFAULT_TRACING_CATEGORIES } from './constants';

var log = require('npmlog');
class TracingHandler {
  constructor(tracing, io) {
    this._io = io;
    this._tracing = tracing;
    this.isTracing = false;
  }

  startTracing(categories = DEFAULT_TRACING_CATEGORIES) {
    if (this.isTracing) {
      throw new Error('Browser is already being traced');
    }
    this.isTracing = true;
    return this._tracing.start({
      categories: categories.join(','),
      transferMode: 'ReturnAsStream'
    });
  }

  async endTracing() {
    if (!this.isTracing) {
      throw new Error(
        'No tracing was initiated, initiate `startTracing()` first'
      );
    }
    this._tracing.end();
    this.isTracing = false;
    let fulfill;
    this.traceEvents = new Promise(x => (fulfill = x));
    await this._tracing.tracingComplete(async event => {
      await this._readIOStream(event.stream).then(fulfill);
    });
    return this.traceEvents;
  }

  getTracingLogs() {
    return this.traceEvents;
  }

  async getSpeedIndex() {
    const { speedIndex, perceptualSpeedIndex } = await speedline(
      await this.traceEvents
    );
    return { speedIndex, perceptualSpeedIndex };
  }

  async getPerformanceMetrics() {
    const traces = TraceOfTab.compute(await this.traceEvents);
    const audit = new FirstInteractiveAudit();
    let timeToFirstInteract = null;

    try {
      timeToFirstInteract = audit.computeWithArtifacts(traces).timeInMs;
    } catch (e) {
      log.warn(
        `Failed to get timeToFirstInteractive due to "${e.friendlyMessage}"`
      );
    }

    return {
      firstPaint: traces.timings.firstPaint,
      firstContentfulPaint: traces.timings.firstContentfulPaint,
      firstMeaningfulPaint: traces.timings.firstMeaningfulPaint,
      domContentLoaded: traces.timings.domContentLoaded,
      timeToFirstInteractive: timeToFirstInteract,
      load: traces.timings.load
    };
  }

  async _readIOStream(stream) {
    let isEOF = false;
    let tracingChunks = '';

    while (!isEOF) {
      const { data, eof } = await this._io.read({ handle: stream });
      tracingChunks += data;

      if (eof) {
        isEOF = true;
        return JSON.parse(tracingChunks);
      }
    }
  }
}

export default TracingHandler;
