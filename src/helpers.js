function assert(value, message) {
    if (!value)
        throw new Error(message);
}

module.exports = { assert }