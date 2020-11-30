'use strict';

const Child = require('./child');
const Parent = require('./parent');
const constants = require('./constants');

let parentIframilies = {};
let childIframilies = {};

module.exports = class Iframily {
    static initParent(id, msgHandler, options = {}) {
        if (parentIframilies[id] && !parentIframilies[id].disposed) {
            // eslint-disable-next-line max-len
            console.error(`[Iframily] - A parent iframily with id "${id}" was already inited, please use another id or dispose the existing one first.`);
            return;
        }

        parentIframilies[id] = new Parent(id, msgHandler, options);
        return parentIframilies[id];
    }

    static initChild(id, msgHandler, options = {}) {
        if (childIframilies[id] && !childIframilies[id].disposed) {
            // eslint-disable-next-line max-len
            console.error(`[Iframily] - A child iframily with id "${id}" was already inited, please use another id or dispose the existing one first.`);
            return;
        }

        childIframilies[id] = new Child(id, msgHandler, options);
        return childIframilies[id];
    }

    static isIframilyMessage(event) {
        let eventData = event && event.data;
        return eventData && eventData._iframilyUid && eventData._iframilyUid.includes(constants.FRAMILY_ID_PREFIX);
    }
};
