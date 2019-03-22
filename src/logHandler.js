import { logger } from './helpers';

let _page;
let _network;
let _log;
let _console;
class LogHandler {

    constructor(page, network, log, console) {
        _page = page;
        _network = network;
        _log = log;
        _console = console;
        Promise.all([_page.enable(), _network.enable(), _log.enable(), _console.enable()]);
    }

    logEntry() {
        logger('Enabled Log Listener')
        _log.entryAdded(({ entry }) => {
            logger(entry);
        });
        _console.messageAdded((params) => {
            logger(params);
        })
        _page.loadEventFired();
    }
}

export default LogHandler;