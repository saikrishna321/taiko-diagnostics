import { logger } from './helpers';

let _entryAdded;
let _loadEventFired;
let _messageAdded;
class LogHandler {

    constructor(entryAdded, loadEventFired, messageAdded) {
        _entryAdded = entryAdded;
        _loadEventFired = loadEventFired;
        _messageAdded = messageAdded;
    }

    logEntry() {
        logger('Enabled Log Listener')
        _entryAdded(({ entry }) => {
            logger(entry);
        });
        _messageAdded((params) => {
            logger(params);
        })
        _loadEventFired();
    }
}

export default LogHandler;