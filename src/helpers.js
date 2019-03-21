var logger = require('npmlog');

function assert(value, message) {
    if (!value)
        throw new Error(message);
}

function log(...stuffToLog) {
    if (process.env.LOGGING) {
        logger.info(`-- ${stuffToLog}`);
    }
}

module.exports = { assert, log }