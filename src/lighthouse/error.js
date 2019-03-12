/**
 * @license Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */

/**
 * NOTE: This code is copied and adapted from the Lighthouse project
 * https://github.com/GoogleChrome/lighthouse
 */

/**
 * Lighthouse string constants
 */
export const ErrorMessages = {
    didntCollectScreenshots: 'Chrome didn\'t collect any screenshots during the page load. Please make sure there is content visible on the page, and then try re-running Lighthouse. ({errorCode})',
    badTraceRecording: 'Something went wrong with recording the trace over your page load. Please run Lighthouse again. ({errorCode})',
    pageLoadTookTooLong: 'Your page took too long to load. Please follow the opportunities in the report to reduce your page load time, and then try re-running Lighthouse. ({errorCode})',
    pageLoadFailed: 'Lighthouse was unable to reliably load the page you requested. Make sure you are testing the correct URL and that the server is properly responding to all requests.',
    pageLoadFailedWithStatusCode: 'Lighthouse was unable to reliably load the page you requested. Make sure you are testing the correct URL and that the server is properly responding to all requests. (Status code: {statusCode})',
    pageLoadFailedWithDetails: 'Lighthouse was unable to reliably load the page you requested. Make sure you are testing the correct URL and that the server is properly responding to all requests. (Details: {errorDetails})',
    pageLoadFailedInsecure: 'The URL you have provided does not have valid security credentials. {securityMessages}',
    internalChromeError: 'An internal Chrome error occurred. Please restart Chrome and try re-running Lighthouse.',
    requestContentTimeout: 'Fetching resource content has exceeded the allotted time',
    urlInvalid: 'The URL you have provided appears to be invalid.',
    protocolTimeout: 'Waiting for DevTools protocol response has exceeded the allotted time. (Method: {protocolMethod})',
    dnsFailure: 'DNS servers could not resolve the provided domain.',
    pageLoadFailedHung: 'Lighthouse was unable to reliably load the URL you requested because the page stopped responding.',  }

/**
 * @typedef LighthouseErrorDefinition
 * @property {string} code
 * @property {string} message
 * @property {RegExp} [pattern]
 */

class LighthouseError extends Error {
    /**
     * @param {!LighthouseErrorDefinition} errorDefinition
     * @param {!Object=} properties
     */
    constructor (errorDefinition, properties) {
        super(errorDefinition.code)
        this.name = 'LHError'
        this.code = errorDefinition.code
        this.friendlyMessage = errorDefinition.message
        if (properties) Object.assign(this, properties)

        Error.captureStackTrace(this, LighthouseError)
    }

    /**
     * @param {Error} err
     */
    static isPageLoadError (err) {
        return err.code === ERRORS.NO_DOCUMENT_REQUEST.code || err.code === ERRORS.FAILED_DOCUMENT_REQUEST.code
    }

    /**
     * @param {string} method
     * @param {{ message: string, data ?: string|undefined}} protocolError
     * @return {!Error|LighthouseError}
     */
    static fromProtocolMessage (method, protocolError) {
        // extract all errors with a regex pattern to match against.
        const protocolErrors = Object.keys(ERRORS).filter(k => ERRORS[k].pattern).map(k => ERRORS[k])
        // if we find one, use the friendly LighthouseError definition
        const matchedErrorDefinition = protocolErrors.find(e => e.pattern.test(protocolError.message))
        if (matchedErrorDefinition) {
            return new LighthouseError(matchedErrorDefinition, {
                protocolMethod: method,
                protocolError: protocolError.message
            })
        }

        // otherwise fallback to building a generic Error
        let errMsg = `(${method}): ${protocolError.message}`
        if (protocolError.data) errMsg += ` (${protocolError.data})`
        const error = new Error(`Protocol error ${errMsg}`)
        return Object.assign(error, { protocolMethod: method, protocolError: protocolError.message })
    }
}

const ERRORS = {
    // Screenshot/speedline errors
    NO_SPEEDLINE_FRAMES: { message: ErrorMessages.didntCollectScreenshots },
    SPEEDINDEX_OF_ZERO: { message: ErrorMessages.didntCollectScreenshots },
    NO_SCREENSHOTS: { message: ErrorMessages.didntCollectScreenshots },

    // Trace parsing errors
    NO_TRACING_STARTED: { message: ErrorMessages.badTraceRecording },
    NO_NAVSTART: { message: ErrorMessages.badTraceRecording },
    NO_FCP: { message: ErrorMessages.badTraceRecording },
    NO_FMP: { message: ErrorMessages.badTraceRecording },
    NO_DCL: { message: ErrorMessages.badTraceRecording },

    // TTFI/TTCI calculation failures
    FMP_TOO_LATE_FOR_FCPUI: { message: ErrorMessages.pageLoadTookTooLong },
    NO_FCPUI_IDLE_PERIOD: { message: ErrorMessages.pageLoadTookTooLong },
    NO_TTI_CPU_IDLE_PERIOD: { message: ErrorMessages.pageLoadTookTooLong },
    NO_TTI_NETWORK_IDLE_PERIOD: { message: ErrorMessages.pageLoadTookTooLong },

    // Page load failures
    NO_DOCUMENT_REQUEST: { message: ErrorMessages.pageLoadFailed },
    FAILED_DOCUMENT_REQUEST: { message: ErrorMessages.pageLoadFailed },

    // Protocol internal failures
    TRACING_ALREADY_STARTED: { message: ErrorMessages.internalChromeError, pattern: /Tracing.*started/ },
    PARSING_PROBLEM: { message: ErrorMessages.internalChromeError, pattern: /Parsing problem/ },
    READ_FAILED: { message: ErrorMessages.internalChromeError, pattern: /Read failed/ },

    // Protocol timeout failures
    REQUEST_CONTENT_TIMEOUT: { message: ErrorMessages.requestContentTimeout }
}

Object.keys(ERRORS).forEach(code => (ERRORS[code].code = code))

/** @type {Object<string, LighthouseErrorDefinition>} */
LighthouseError.errors = ERRORS
export default LighthouseError
