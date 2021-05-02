'use strict';

const Child = require('./child');
const Parent = require('./parent');
const constants = require('./constants');

let parentIframilies = {};
let childIframilies = {};

function validateIdAvailable(id, iframilies, type) {
    if (iframilies[id] && !iframilies[id].isDisposed) {
        // eslint-disable-next-line max-len
        console.error(`[Iframily] - A ${type} iframily with id "${id}" was already initialized, please use another id or dispose the existing one first.`);
        return false;
    }

    return true;
}

function validateTargetOrigin(targetOrigin, id) {
    if (!targetOrigin) {
        console.error(`[Iframily] - Missing "targetOrigin" argument, not initializing "${id}" iframily id.`);
        return false;
    }

    if (typeof targetOrigin !== 'string') {
        // eslint-disable-next-line max-len
        console.error(`[Iframily] - "targetOrigin" is of type ${typeof targetOrigin} but must be of type string, not initializing "${id}" iframily id.`);
        return false;
    }

    if (targetOrigin === '*') {
        // eslint-disable-next-line max-len
        console.error(`[Iframily] - "*" (wildcard) is not allowed for "targetOrigin" argument. If you are sure about what you are doing, use "${constants.DANGEROUSLY_SET_WILDCARD}". See more info here: ${constants.README_SINGLETON_URL}`);
        return false;
    }

    return true;
}

function validateInFrame(id) {
    if (window.parent === window) {
        // eslint-disable-next-line max-len
        console.error(`[Iframily] - Attempted to initialize a child iframily in a non embedded window, not initializing "${id}" iframily id.`);
        return false;
    }

    return true;
}

module.exports = class Iframily {
    static initParent(id, targetOrigin, msgHandler, options = {}) {
        /* eslint-disable max-statements-per-line */
        if (!validateIdAvailable(id, parentIframilies, 'parent')) { return; }
        if (!validateTargetOrigin(targetOrigin, id)) { return; }
        /* eslint-enable max-statements-per-line */

        parentIframilies[id] = new Parent(id, targetOrigin, msgHandler, options);
        return parentIframilies[id];
    }

    static initChild(id, targetOrigin, msgHandler, options = {}) {
        /* eslint-disable max-statements-per-line */
        if (!validateIdAvailable(id, childIframilies, 'child')) { return; }
        if (!validateTargetOrigin(targetOrigin, id)) { return; }
        if (!validateInFrame(id)) { return; }
        /* eslint-enable max-statements-per-line */

        childIframilies[id] = new Child(id, targetOrigin, msgHandler, options);
        return childIframilies[id];
    }

    static isIframilyMessage(event) {
        let eventData = event && event.data;
        return eventData && eventData._iframilyUid && eventData._iframilyUid.includes(constants.FRAMILY_ID_PREFIX);
    }
};
