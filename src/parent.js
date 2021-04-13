'use strict';

const Base = require('./base');
const constants = require('./constants');

module.exports = class Parent extends Base {
    _init() {
        this._iframilyType = constants.PARENT;

        this._handleMessage = this._handleMessage.bind(this);
        window.addEventListener('message', this._handleMessage);
    }

    _handleMessage(event) {
        // Validate that the sender origin matches the target origin specified.
        if (this._targetOrigin !== '*' && event.origin !== this._targetOrigin) {
            return;
        }

        let eventData = event && event.data;

        // Only handle this iframily message (according id) and originating from child.
        if (eventData && eventData._iframilyUid === this._iframilyUid && eventData._fromType === constants.CHILD) {
            // If got init request (and not connected already) => init connection.
            // If connected => handle it.
            if (eventData.msg === constants.FRAMILY_INIT) {
                // Child might still be sending connection init messages even though
                // we already started the connection process, ignore them.
                if (!this._hasConnected) {
                    // Find the IFrame that sent this event using 'event.source'.
                    // NOTE: This get only the top level IFrames (which is good).
                    let iframes = document.getElementsByTagName('iframe');
                    for (let i = 0; i < iframes.length; i++) {
                        if (iframes[i].contentWindow === event.source) {
                            this._targetWindow = iframes[i].contentWindow;

                            // Set that we are connected and send init successful message.
                            // NOTE: Setting connected first is important in order for the message to be sent.
                            this._hasConnected = true;

                            this._onPairedHandler();

                            // NOTE: Sending the 'init successful' event before sending queued messages is also important
                            // NOTE: in order for child to be connected before receiving messages.
                            this._sendMessage(constants.FRAMILY_INIT_SUCCESSFUL);

                            this._sendQueuedMessages();
                            break;
                        }
                    }
                }
            } else if (this._hasConnected) {
                super._handleMessage(eventData);
            }
        }
    }

    dispose() {
        super.dispose();

        window.removeEventListener('message', this._handleMessage);
    }
};
