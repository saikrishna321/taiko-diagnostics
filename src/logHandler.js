import { logger } from './helpers';

let _entryAdded;
let _loadEventFired;
let _runTime;

class LogHandler {

    constructor(entryAdded, loadEventFired, runTime) {
        _entryAdded = entryAdded;
        _loadEventFired = loadEventFired;
        _runTime = runTime;
    }

    logEntry() {
        _entryAdded(({ entry }) => {
            logger({ level: entry.level, source: entry.source, url: entry.url });
        });

        _runTime.consoleAPICalled((params) => {
            logger(params);
        });

        _runTime.exceptionThrown( ( { exceptionDetails }) => {
            logger(exceptionDetails.exception.description);
        });
        _loadEventFired();
    }
}

export default LogHandler;