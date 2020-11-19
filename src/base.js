'use strict';

const constants = require('./constants');

const PUBLIC_METHODS = ['sendMessage', 'dispose'];

module.exports = class Base {
    constructor(id, msgHandler, options) {
        this._id = id;

        this._onPairedHandler = options.onPairedHandler || function() {};
        this._onDisposedHandler = options.onDisposedHandler || function() {};
        this._targetOrigin = options.targetOrigin || '*';

        // Identifier for all messages.
        // This will allow us to identify iframily messages and to match parent and child.
        this._iframilyUid = `${constants.FRAMILY_ID_PREFIX}${this._id}`;

        this._msgHandler = msgHandler || function() {};
        this._hasConnected = false;
        this._disposed = false;

        // Queue for messages requested to be sent before connection was made.
        this._msgQueue = [];

        this._pendingCb = {};
        this._cbUid = 0;

        // Fix (public) methods binding to 'this'.
        this._bindPublicMethods();

        this._init();
    }

    // #region PRIVATE METHODS

    _bindPublicMethods() {
        PUBLIC_METHODS.forEach(function(method) {
            this[method] = this[method].bind(this);
        }.bind(this));
    }

    _init() { throw new Error('To be overridden in extending classes.'); }

    // Sends all the queued messages.
    _sendQueuedMessages() {
        this._msgQueue.forEach((msgQueueFunc) => {
            msgQueueFunc();
        });

        this._msgQueue = [];
    }

    // The acutal 'postMessage' action.
    _postMessage(wrappedMsg) {
        try {
            this._targetWindow.postMessage(wrappedMsg, this._targetOrigin);
        } catch (err) {
            console.error('[Iframily] - Error when posting message:', err);
        }
    }

    // Sends a message.
    _sendMessage(msg, cbDefer, options = {}) {
        let wrappedMsg = {
            _iframilyUid: this._iframilyUid,
            _fromType: this._iframilyType,
            msg: msg
        };

        // Callbacks logic.
        if (cbDefer) {
            this._cbUid++;
            this._pendingCb[this._cbUid] = cbDefer;
            wrappedMsg._cbUid = this._cbUid;
        }

        // If connected (or force send requested), send the message.
        // Otherwise, add it to the message queue.
        if (this._hasConnected || options.forceSend) {
            this._postMessage(wrappedMsg);
        } else {
            // eslint-disable-next-line no-console
            console.warn('[Iframily] - No one connected yet, queuing message', msg);
            this._msgQueue.push(this._postMessage.bind(this, wrappedMsg));
        }
    }

    // Posts a response.
    _sendResponse(cbUid, options) {
        let wrappedMsg = {
            _iframilyUid: this._iframilyUid,
            _fromType: this._iframilyType,
            _isResponse: true,

            _cbUid: cbUid,
            _isResolved: options.isResolved,
            _isRejected: options.isRejected,
            _cbResolveValue: options.value,
            _cbRejectError: options.err,
        };

        this._postMessage(wrappedMsg);
    }

    /* NOTE: overridden in extending class */
    _handleMessage(wrappedMsg) {
        if (wrappedMsg._isResponse) {
            this._handleResponse(wrappedMsg);
        } else {
            Promise.resolve()
                .then(() => {
                    return this._msgHandler(wrappedMsg.msg);
                })
                .then((value) => { this._sendResponse(wrappedMsg._cbUid, { isResolved: true, value: value }); })
                .catch((err) => { this._sendResponse(wrappedMsg._cbUid, { isRejected: true, err: err }); });
        }
    }

    // Resolve the original message promise with the response value.
    _handleResponse(wrappedMsg) {
        if (wrappedMsg._cbUid) {
            let cbDefer = this._pendingCb[wrappedMsg._cbUid];
            if (wrappedMsg._isResolved) {
                cbDefer.resolve(wrappedMsg._cbResolveValue);
            } else if (wrappedMsg._isRejected) {
                cbDefer.reject(wrappedMsg._cbRejectError);
            } else {
                throw new Error(`Missing resolve/reject information on response: ${wrappedMsg}`);
            }

            // Cleanup.
            delete this._pendingCb[wrappedMsg._cbUid];
        }
    }

    _displayDisposedError() {
        console.error('[Iframily] - Attempting to use a disposed instance');
    }

    // #endregion

    // #region MAIN API

    sendMessage(msg) {
        if (this._disposed) {
            return this._displayDisposedError();
        }

        return new Promise((resolve, reject) => {
            this._sendMessage(msg, { resolve, reject });
        });
    }

    /* NOTE: overridden in extending class */
    dispose() {
        if (this._disposed) {
            return this._displayDisposedError();
        }

        this._hasConnected = false;
        this._msgQueue = [];

        this._disposed = true;
        this._onDisposedHandler();
    }

    get disposed() {
        return this._disposed;
    }

    get id() {
        return this._id;
    }

    // #endregion
};
