'use strict';

const Child = require('./child');
const Parent = require('./parent');
const constants = require('./constants');

let parentFramilies = {};
let childFramilies = {};

module.exports = class Iframily {
    static initParent(id, msgHandler, options = {}) {
        if (parentFramilies[id] && !parentFramilies[id].disposed) {
            // eslint-disable-next-line max-len
            console.error(`[Iframily] - A parent iframily with id "${id}" was already inited, please use another id or dispose the existing one first.`);
            return;
        }

        parentFramilies[id] = new Parent(id, msgHandler, options);
        return parentFramilies[id];
    }

    static initChild(id, msgHandler, options = {}) {
        if (childFramilies[id] && !childFramilies[id].disposed) {
            // eslint-disable-next-line max-len
            console.error(`[Iframily] - A child iframily with id "${id}" was already inited, please use another id or dispose the existing one first.`);
            return;
        }

        childFramilies[id] = new Child(id, msgHandler, options);
        return childFramilies[id];
    }

    static isIframilyMessage(event) {
        let eventData = event && event.data;
        return eventData && eventData._iframilyUid && eventData._iframilyUid.includes(constants.FRAMILY_ID_PREFIX);
    }
};
