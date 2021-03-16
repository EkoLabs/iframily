'use strict';

const Child = require('./child');
const Parent = require('./parent');
const constants = require('./constants');

let parentIframilies = {};
let childIframilies = {};

function validateNotDisposed(id, iframilies, type) {
    if (iframilies[id] && !iframilies[id].disposed) {
        // eslint-disable-next-line max-len
        console.error(`[Iframily] - A ${type} iframily with id "${id}" was already inited, please use another id or dispose the existing one first.`);
        return false;
    }

    return true;
}

function validateTargetOrigin(targetOrigin, id) {
    if (!targetOrigin) {
        console.error(`[Iframily] - Missing "targetOrigin" argument, not initing "${id}" iframily id.`);
        return false;
    }

    if (typeof targetOrigin !== 'string') {
        // eslint-disable-next-line max-len
        console.error(`[Iframily] - "targetOrigin" is of type ${typeof targetOrigin} but must be of type string, not initing "${id}" iframily id.`);
        return false;
    }

    if (targetOrigin === '*') {
        // eslint-disable-next-line max-len
        console.error(`[Iframily] - "*" (wildcard) is not allowed for "targetOrigin" argument. If you are sure about what you are doing, use "dangerouslySetWildcard".`);
        return false;
    }

    return true;
}

module.exports = class Iframily {
    static initParent(id, targetOrigin, msgHandler, options = {}) {
        /* eslint-disable max-statements-per-line */
        if (!validateNotDisposed(id, parentIframilies, 'parent')) { return; }
        if (!validateTargetOrigin(targetOrigin, id)) { return; }
        /* eslint-enable max-statements-per-line */

        parentIframilies[id] = new Parent(id, targetOrigin, msgHandler, options);
        return parentIframilies[id];
    }

    static initChild(id, targetOrigin, msgHandler, options = {}) {
        /* eslint-disable max-statements-per-line */
        if (!validateNotDisposed(id, childIframilies, 'child')) { return; }
        if (!validateTargetOrigin(targetOrigin, id)) { return; }
        /* eslint-enable max-statements-per-line */

        childIframilies[id] = new Child(id, targetOrigin, msgHandler, options);
        return childIframilies[id];
    }

    static isIframilyMessage(event) {
        let eventData = event && event.data;
        return eventData && eventData._iframilyUid && eventData._iframilyUid.includes(constants.FRAMILY_ID_PREFIX);
    }
};
