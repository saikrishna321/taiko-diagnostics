import { logger } from './helpers';

class LogHandler {
  constructor(entryAdded, loadEventFired, runTime) {
    this._entryAdded = entryAdded;
    this._loadEventFired = loadEventFired;
    this._runTime = runTime;
  }

  logEntry() {
    this._entryAdded(({ entry }) => {
      logger({ level: entry.level, source: entry.source, url: entry.url });
    });

    this._runTime.consoleAPICalled(params => {
      const [{ value }] = params.args;
      const [{ url }] = params.stackTrace.callFrames;
      logger({ type: params.type, value, url });
    });

    this._runTime.exceptionThrown(({ exceptionDetails }) => {
      logger(exceptionDetails.exception.description);
    });
    this._loadEventFired();
  }
}

export default LogHandler;
