'use strict';

const Base = require('./base');
const constants = require('./constants');

module.exports = class Child extends Base {
    _init() {
        this._iframilyType = constants.CHILD;
        this._targetWindow = window.parent;

        this._handleMessage = this._handleMessage.bind(this);
        window.addEventListener('message', this._handleMessage);

        // Attempt to connect to parent in interval (do first attempt immediately).
        let attemptToConnectFunc = () => {
            // 'forceSend' set true since we want to send this message even though we are not connected yet.
            this._sendMessage(constants.FRAMILY_INIT, null, { forceSend: true });

            return attemptToConnectFunc;
        };
        this._attemptToConnectInterval = setInterval(attemptToConnectFunc(), constants.ATTEMPT_TO_CONNECT_INTERVAL);
    }

    _handleMessage(event) {
        // Validate that the sender origin matches the target origin specified.
        if (this._targetOrigin !== '*' && event.origin !== this._targetOrigin) {
            return;
        }

        let eventData = event && event.data;

        // Only handle this iframily message (according id).
        if (eventData && eventData._iframilyUid === this._iframilyUid && eventData._fromType === constants.PARENT) {
            // If not connected and got init successful message => init connection.
            // If connected => handle it.
            if (!this._hasConnected && eventData.msg === constants.FRAMILY_INIT_SUCCESSFUL) {
                this._hasConnected = true;
                clearInterval(this._attemptToConnectInterval);

                this._onPairedHandler();

                this._sendQueuedMessages();
            } else if (this._hasConnected) {
                super._handleMessage(eventData);
            }
        }
    }

    dispose() {
        super.dispose();

        window.removeEventListener('message', this._handleMessage);

        // Don't attempt to connect anymore.
        clearInterval(this._attemptToConnectInterval);
    }
};
