'use strict';

const constants = require('./constants');

let framesMap = {};
function resetFrames() {
    framesMap = {};
}
function getFrame(type) {
    return framesMap[type];
}
function setFrame(frame, type) {
    framesMap[type] = frame;
}

async function initIframily(type, options = {}) {
    let iframilyVarName =  options.iframilyVarName || constants.DEFAULT_FRAMILY_VAR_NAME;
    let id = options.id || constants.DEFAULT_FRAMILY_ID;
    let targetOrigin = options.targetOrigin || constants.DANGEROUSLY_SET_WILDCARD;

    let frame = framesMap[type];
    let initMethodName = constants.INIT_METHOD_NAMES[type];

    await frame.evaluate((_iframilyVarName, _id, _targetOrigin, _initMethodName) => {
        // This object might have already been initialized by other iframilies init.
        window.messagesReceived = window.messagesReceived || {};

        // Messages received specific to this iframily id.
        window.messagesReceived[_id] = [];

        window.pairedCount = window.pairedCount || {};
        window.disposedCount = window.disposedCount || {};
        window.pairedCount[_id] = window.pairedCount[_id] || 0;
        window.disposedCount[_id] = window.disposedCount[_id] || 0;
        let onPairedHandler = function() {
            window.pairedCount[_id]++;
        };
        let onDisposedHandler = function() {
            window.disposedCount[_id]++;
        };

        window[_iframilyVarName] = window.Iframily[_initMethodName](_id, _targetOrigin, (msg) => {
            window.messagesReceived[_id].push(msg);
        }, {
            onPairedHandler: onPairedHandler,
            onDisposedHandler: onDisposedHandler
        });
    }, iframilyVarName, id, targetOrigin, initMethodName);
}

async function sendMessage(type, msg, options = {}) {
    let iframilyVarName = options.iframilyVarName || constants.DEFAULT_FRAMILY_VAR_NAME;

    let frame = framesMap[type];

    await frame.evaluate((_iframilyVarName, _msg) => {
        window[_iframilyVarName].sendMessage(_msg);
    }, iframilyVarName, msg);
}

// NOTE: undefined will convert to null (since in array)... https://github.com/puppeteer/puppeteer/issues/1510
function getMessages(type, options = {}) {
    let id = options.id || constants.DEFAULT_FRAMILY_ID;

    let frame = framesMap[type];
    return frame.evaluate(_id => window.messagesReceived[_id], id);
}

async function waitForMessages(type, expectedTotalMessagesCount, options = {}) {
    let id = options.id || constants.DEFAULT_FRAMILY_ID;

    let frame = framesMap[type];

    await frame.waitForFunction((_id, _expectedTotalMessagesCount) => {
        return window.messagesReceived[_id].length === _expectedTotalMessagesCount;
    }, {}, id, expectedTotalMessagesCount);

    return getMessages(type, options);
}

async function dispose(type, options = {}) {
    let iframilyVarName = options.iframilyVarName || constants.DEFAULT_FRAMILY_VAR_NAME;

    let frame = framesMap[type];

    await frame.evaluate((_iframilyVarName) => {
        window[_iframilyVarName].dispose();
    }, iframilyVarName);
}

function isDisposed(type, options = {}) {
    let iframilyVarName = options.iframilyVarName || constants.DEFAULT_FRAMILY_VAR_NAME;

    let frame = framesMap[type];

    return frame.evaluate((_iframilyVarName) => {
        return window[_iframilyVarName].isDisposed;
    }, iframilyVarName);
}

function getPairedCount(type, options = {}) {
    let id = options.id || constants.DEFAULT_FRAMILY_ID;

    let frame = framesMap[type];

    return frame.evaluate((_id) => {
        return window.pairedCount[_id];
    }, id);
}

function getDisposedCount(type, options = {}) {
    let id = options.id || constants.DEFAULT_FRAMILY_ID;

    let frame = framesMap[type];

    return frame.evaluate((_id) => {
        return window.disposedCount[_id];
    }, id);
}

function wrapConsoleError(type) {
    let frame = framesMap[type];

    return frame.evaluate(() => {
        let origConsoleError = console.error;

        window.errorMessages = [];
        let errorWrapper = function() {
            let argsArr = Array.from(arguments);
            window.errorMessages.push(argsArr);
            origConsoleError.apply(null, arguments);
        };

        console.error = errorWrapper;
    });
}

function getConsoleErrors(type) {
    let frame = framesMap[type];
    return frame.evaluate(() => window.errorMessages);
}

module.exports = {
    resetFrames,
    getFrame,
    setFrame,

    initIframily,
    sendMessage,
    getMessages,
    waitForMessages,
    dispose,
    isDisposed,
    getPairedCount,
    getDisposedCount,

    wrapConsoleError,
    getConsoleErrors
};
