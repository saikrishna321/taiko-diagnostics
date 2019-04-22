import { logger } from './helpers';

let _entryAdded;
let _loadEventFired;
let _messageAdded;
let _exceptionThrown;

class LogHandler {

    constructor(entryAdded, loadEventFired, messageAdded, exceptionThrown) {
        _entryAdded = entryAdded;
        _loadEventFired = loadEventFired;
        _messageAdded = messageAdded;
        _exceptionThrown = exceptionThrown;
    }

    logEntry() {
        _entryAdded(({ entry }) => {
            logger({ level: entry.level, source: entry.source, url: entry.url });
        });
        _messageAdded((params) => {
            logger(params);
        });
        _exceptionThrown( ( { exceptionDetails }) => {
            logger(exceptionDetails.exception.description);
        });
        _loadEventFired();
    }
}

export default LogHandler;