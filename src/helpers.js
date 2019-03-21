import log from 'npmlog';

function assert(value, message) {
    if (!value)
        throw new Error(message);
}

function logger(value) {
    typeof value === 'object' ? log.info(JSON.stringify(value)) : log.info(`-${value}`);
}

module.exports = { assert, logger }