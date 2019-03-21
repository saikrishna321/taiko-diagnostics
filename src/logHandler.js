import { logger } from './helpers';

let _page;
let _network;
let _log;
class LogHandler {

    constructor(page, network, log) {
        _page = page;
        _network = network;
        _log = log;
        Promise.all([_page.enable(), _network.enable(), _log.enable()]);
    }

    async logEntry() {
        logger('Enabled Log Listener')
        await _log.entryAdded(({ entry }) => {
            logger(entry);
        });
        await  _page.loadEventFired();
    }
}

export default LogHandler;