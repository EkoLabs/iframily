/* eslint-disable max-len */
/* eslint-disable no-magic-numbers */
'use strict';

const constants = require('./constants.js');
const helpers = require('./helpers.js');

const ORIGIN = 'http://localhost:9135';
const PARENT_URI = `${ORIGIN}/test/public/basic/parent.html`;

describe('basic', () => {
    beforeEach(async () => {
        await page.goto(PARENT_URI);

        helpers.resetFrames();
        helpers.setFrame(page, constants.FRAME_TYPE_PARENT);
        helpers.setFrame(page.frames().find(frame => frame.name() === 'childFrame'), constants.FRAME_TYPE_CHILD);
    });

    describe('parent to child', () => {
        test('should send message', async () => {
            await helpers.initIframily(constants.FRAME_TYPE_PARENT);
            await helpers.initIframily(constants.FRAME_TYPE_CHILD);

            await helpers.sendMessage(constants.FRAME_TYPE_PARENT, { text: 'hi child!' });
            let messagesFromParent = await helpers.waitForMessages(constants.FRAME_TYPE_CHILD, 1);
            expect(messagesFromParent[0].text).toBe('hi child!');
        });

        test('should get response', async () => {
            let parentFrame = helpers.getFrame(constants.FRAME_TYPE_PARENT);
            let childFrame = helpers.getFrame(constants.FRAME_TYPE_CHILD);
            await parentFrame.evaluate((DANGEROUSLY_SET_WILDCARD) => {
                window.messagesReceived = [];
                window.messageResponses = [];
                window.messageResponsesCatch = [];
                window.iframily = window.Iframily.initParent('someId', DANGEROUSLY_SET_WILDCARD, (msg) => {
                    window.messagesReceived.push(msg);
                });
            }, constants.DANGEROUSLY_SET_WILDCARD);
            await childFrame.evaluate((DANGEROUSLY_SET_WILDCARD) => {
                window.iframily = window.Iframily.initChild('someId', DANGEROUSLY_SET_WILDCARD, (msg) => {
                    if (msg === 'hello from parent sync') {
                        return 'child response sync!';
                    }

                    if (msg === 'hello from parent async') {
                        return new Promise((resolve) => {
                            resolve('child response async!');
                        });
                    }

                    if (msg === 'hello from parent async catch no err value') {
                        return new Promise((resolve, reject) => {
                            reject();
                        });
                    }

                    if (msg === 'hello from parent async catch with err value') {
                        return new Promise((resolve, reject) => {
                            reject(new Error('child response async reject!'));
                        });
                    }
                });
            }, constants.DANGEROUSLY_SET_WILDCARD);

            // Sync response.
            await parentFrame.evaluate(() => {
                window.iframily.sendMessage('hello from parent sync')
                    .then((response) => {
                        window.messageResponses.push(response);
                    });
            });
            await parentFrame.waitForFunction(() => {
                return window.messageResponses.length === 1;
            });
            let responsesFromChild = await parentFrame.evaluate(() => window.messageResponses);
            expect(responsesFromChild[0]).toBe('child response sync!');

            // Async response.
            await parentFrame.evaluate(() => {
                window.iframily.sendMessage('hello from parent async')
                    .then((response) => {
                        window.messageResponses.push(response);
                    });
            });
            await parentFrame.waitForFunction(() => {
                return window.messageResponses.length === 2;
            });
            responsesFromChild = await parentFrame.evaluate(() => window.messageResponses);
            expect(responsesFromChild[1]).toBe('child response async!');

            // Async response (rejected with no err value).
            await parentFrame.evaluate(() => {
                window.iframily.sendMessage('hello from parent async catch no err value')
                    .catch((response) => {
                        // Save the error's message.
                        window.messageResponsesCatch.push(response);
                    });
            });
            await parentFrame.waitForFunction(() => {
                return window.messageResponsesCatch.length === 1;
            });
            let responsesFromChildCatch = await parentFrame.evaluate(() => window.messageResponsesCatch);
            let responsesFromChildCatchNoErrValue = responsesFromChildCatch[0];
            expect(responsesFromChildCatchNoErrValue).toBe(null);

            // Async response (rejected with err value).
            await parentFrame.evaluate(() => {
                window.iframily.sendMessage('hello from parent async catch with err value')
                    .catch((response) => {
                        // Save the error's message.
                        window.messageResponsesCatch.push(response.message);
                    });
            });
            await parentFrame.waitForFunction(() => {
                return window.messageResponsesCatch.length === 2;
            });
            responsesFromChildCatch = await parentFrame.evaluate(() => window.messageResponsesCatch);
            let responsesFromChildCatchWithErrValue = responsesFromChildCatch[1];
            expect(responsesFromChildCatchWithErrValue).toBe('child response async reject!');
        });

        test('should queue messages and send when child connected', async () => {
            await helpers.initIframily(constants.FRAME_TYPE_PARENT);
            await helpers.sendMessage(constants.FRAME_TYPE_PARENT, { num: 1 });
            await helpers.sendMessage(constants.FRAME_TYPE_PARENT, { num: 2 });
            await helpers.sendMessage(constants.FRAME_TYPE_PARENT, { num: 3 });

            await helpers.initIframily(constants.FRAME_TYPE_CHILD);
            let messagesFromParent = await helpers.waitForMessages(constants.FRAME_TYPE_CHILD, 3);
            expect(messagesFromParent[0].num).toBe(1);
            expect(messagesFromParent[1].num).toBe(2);
            expect(messagesFromParent[2].num).toBe(3);
        });

        test('should dispose connection', async () => {
            await helpers.initIframily(constants.FRAME_TYPE_PARENT);
            await helpers.initIframily(constants.FRAME_TYPE_CHILD);

            await helpers.sendMessage(constants.FRAME_TYPE_PARENT, { text: 'connected message' });
            let messagesFromParent = await helpers.waitForMessages(constants.FRAME_TYPE_CHILD, 1);
            expect(messagesFromParent[0].text).toBe('connected message');

            await helpers.dispose(constants.FRAME_TYPE_CHILD);
            let isChildDisposed = await helpers.isDisposed(constants.FRAME_TYPE_CHILD);
            expect(isChildDisposed).toBe(true);

            await helpers.wrapConsoleError(constants.FRAME_TYPE_CHILD);
            await helpers.sendMessage(constants.FRAME_TYPE_CHILD, { text: 'disposed attempt' });
            let errorsChild = await helpers.getConsoleErrors(constants.FRAME_TYPE_CHILD);
            expect(errorsChild).toHaveLength(1);
            expect(errorsChild[0][0]).toBe('[Iframily] - Attempting to use a disposed instance');
            let messagesFromChild = await helpers.getMessages(constants.FRAME_TYPE_PARENT);
            expect(messagesFromChild).toHaveLength(0);

            await helpers.sendMessage(constants.FRAME_TYPE_PARENT, { text: 'not connected message' });
            messagesFromParent = await helpers.getMessages(constants.FRAME_TYPE_CHILD);
            expect(messagesFromParent[0].text).toBe('connected message');
            expect(messagesFromParent).toHaveLength(1);
        });

        describe('multiple child with different ids', () => {
            test('should send to correct child id (child that should receive the messages was inited first).', async () => {
                await helpers.initIframily(constants.FRAME_TYPE_PARENT, {
                    id: 'testId-1'
                });
                await helpers.initIframily(constants.FRAME_TYPE_CHILD, {
                    iframilyVarName: 'iframily1',
                    id: 'testId-1'
                });
                await helpers.initIframily(constants.FRAME_TYPE_CHILD, {
                    iframilyVarName: 'iframily2',
                    id: 'testId-2'
                });

                await helpers.sendMessage(constants.FRAME_TYPE_PARENT, { text: 'hi child 1!' });

                let messagesFromParentChild1 = await helpers.waitForMessages(constants.FRAME_TYPE_CHILD, 1, { id: 'testId-1' });
                expect(messagesFromParentChild1[0].text).toBe('hi child 1!');

                let messagesFromParentChild2 = await helpers.getMessages(constants.FRAME_TYPE_CHILD, { id: 'testId-2' });
                expect(messagesFromParentChild2).toHaveLength(0);
            });

            test('should send to correct child id (child that should receive the messages was inited second).', async () => {
                await helpers.initIframily(constants.FRAME_TYPE_PARENT, {
                    id: 'testId-1'
                });
                await helpers.initIframily(constants.FRAME_TYPE_CHILD, {
                    iframilyVarName: 'iframily2',
                    id: 'testId-2'
                });
                await helpers.initIframily(constants.FRAME_TYPE_CHILD, {
                    iframilyVarName: 'iframily1',
                    id: 'testId-1'
                });

                await helpers.sendMessage(constants.FRAME_TYPE_PARENT, { text: 'hi child 1!' });

                let messagesFromParentChild1 = await helpers.waitForMessages(constants.FRAME_TYPE_CHILD, 1, { id: 'testId-1' });
                expect(messagesFromParentChild1[0].text).toBe('hi child 1!');

                let messagesFromParentChild2 = await helpers.getMessages(constants.FRAME_TYPE_CHILD, { id: 'testId-2' });
                expect(messagesFromParentChild2).toHaveLength(0);
            });
        });
    });

    describe('child to parent', () => {
        test('should send message', async () => {
            await helpers.initIframily(constants.FRAME_TYPE_PARENT);
            await helpers.initIframily(constants.FRAME_TYPE_CHILD);

            await helpers.sendMessage(constants.FRAME_TYPE_CHILD, { text: 'hi parent!' });
            let messagesFromChild = await helpers.waitForMessages(constants.FRAME_TYPE_PARENT, 1);
            expect(messagesFromChild[0].text).toBe('hi parent!');
        });

        test('should get response', async () => {
            let parentFrame = helpers.getFrame(constants.FRAME_TYPE_PARENT);
            let childFrame = helpers.getFrame(constants.FRAME_TYPE_CHILD);
            await childFrame.evaluate((DANGEROUSLY_SET_WILDCARD) => {
                window.messagesReceived = [];
                window.messageResponses = [];
                window.messageResponsesCatch = [];
                window.iframily = window.Iframily.initChild('someId', DANGEROUSLY_SET_WILDCARD, (msg) => {
                    window.messagesReceived.push(msg);
                });
            }, constants.DANGEROUSLY_SET_WILDCARD);
            await parentFrame.evaluate((DANGEROUSLY_SET_WILDCARD) => {
                window.iframily = window.Iframily.initParent('someId', DANGEROUSLY_SET_WILDCARD, (msg) => {
                    if (msg === 'hello from child sync') {
                        return 'parent response sync!';
                    }

                    if (msg === 'hello from child async') {
                        return new Promise((resolve) => {
                            resolve('parent response async!');
                        });
                    }

                    if (msg === 'hello from child async catch no err value') {
                        return new Promise((resolve, reject) => {
                            reject();
                        });
                    }

                    if (msg === 'hello from child async catch with err value') {
                        return new Promise((resolve, reject) => {
                            reject(new Error('parent response async reject!'));
                        });
                    }
                });
            }, constants.DANGEROUSLY_SET_WILDCARD);

            // Sync response.
            await childFrame.evaluate(() => {
                window.iframily.sendMessage('hello from child sync')
                    .then((response) => {
                        window.messageResponses.push(response);
                    });
            });
            await childFrame.waitForFunction(() => {
                return window.messageResponses.length === 1;
            });
            let responsesFromParent = await childFrame.evaluate(() => window.messageResponses);
            expect(responsesFromParent[0]).toBe('parent response sync!');

            // Async response.
            await childFrame.evaluate(() => {
                window.iframily.sendMessage('hello from child async')
                    .then((response) => {
                        window.messageResponses.push(response);
                    });
            });
            await childFrame.waitForFunction(() => {
                return window.messageResponses.length === 2;
            });
            responsesFromParent = await childFrame.evaluate(() => window.messageResponses);
            expect(responsesFromParent[1]).toBe('parent response async!');

            // Async response (rejected with no err value).
            await childFrame.evaluate(() => {
                window.iframily.sendMessage('hello from child async catch no err value')
                    .catch((response) => {
                        // Save the error's message.
                        window.messageResponsesCatch.push(response);
                    });
            });
            await childFrame.waitForFunction(() => {
                return window.messageResponsesCatch.length === 1;
            });
            let responsesFromParentCatch = await childFrame.evaluate(() => window.messageResponsesCatch);
            let responsesFromParentCatchNoErrValue = responsesFromParentCatch[0];
            expect(responsesFromParentCatchNoErrValue).toBe(null);

            // Async response (rejected with err value).
            await childFrame.evaluate(() => {
                window.iframily.sendMessage('hello from child async catch with err value')
                    .catch((response) => {
                        // Save the error's message.
                        window.messageResponsesCatch.push(response.message);
                    });
            });
            await childFrame.waitForFunction(() => {
                return window.messageResponsesCatch.length === 2;
            });
            responsesFromParentCatch = await childFrame.evaluate(() => window.messageResponsesCatch);
            let responsesFromParentCatchWithErrValue = responsesFromParentCatch[1];
            expect(responsesFromParentCatchWithErrValue).toBe('parent response async reject!');
        });

        test('should queue messages and send when parent connected', async () => {
            await helpers.initIframily(constants.FRAME_TYPE_CHILD);
            await helpers.sendMessage(constants.FRAME_TYPE_CHILD, { num: 1 });
            await helpers.sendMessage(constants.FRAME_TYPE_CHILD, { num: 2 });
            await helpers.sendMessage(constants.FRAME_TYPE_CHILD, { num: 3 });

            await helpers.initIframily(constants.FRAME_TYPE_PARENT);
            let messagesFromChild = await helpers.waitForMessages(constants.FRAME_TYPE_PARENT, 3);
            expect(messagesFromChild[0].num).toBe(1);
            expect(messagesFromChild[1].num).toBe(2);
            expect(messagesFromChild[2].num).toBe(3);
        });

        test('should dispose connection', async () => {
            await helpers.initIframily(constants.FRAME_TYPE_PARENT);
            await helpers.initIframily(constants.FRAME_TYPE_CHILD);

            await helpers.sendMessage(constants.FRAME_TYPE_CHILD, { text: 'connected message' });
            let messagesFromChild = await helpers.waitForMessages(constants.FRAME_TYPE_PARENT, 1);
            expect(messagesFromChild[0].text).toBe('connected message');

            await helpers.dispose(constants.FRAME_TYPE_PARENT);
            let isParentDisposed = await helpers.isDisposed(constants.FRAME_TYPE_PARENT);
            expect(isParentDisposed).toBe(true);

            await helpers.wrapConsoleError(constants.FRAME_TYPE_PARENT);
            await helpers.sendMessage(constants.FRAME_TYPE_PARENT, { text: 'disposed attempt' });
            let errorsParent = await helpers.getConsoleErrors(constants.FRAME_TYPE_PARENT);
            expect(errorsParent).toHaveLength(1);
            expect(errorsParent[0][0]).toBe('[Iframily] - Attempting to use a disposed instance');
            let messagesFromParent = await helpers.getMessages(constants.FRAME_TYPE_CHILD);
            expect(messagesFromParent).toHaveLength(0);

            await helpers.sendMessage(constants.FRAME_TYPE_CHILD, { text: 'not connected message' });
            messagesFromChild = await helpers.getMessages(constants.FRAME_TYPE_PARENT);
            expect(messagesFromChild[0].text).toBe('connected message');
            expect(messagesFromChild).toHaveLength(1);
        });

        describe('multiple parent with different ids', () => {
            test('should send to correct parent id (parent that should receive the messages was inited first).', async () => {
                await helpers.initIframily(constants.FRAME_TYPE_CHILD, {
                    id: 'testId-1'
                });
                await helpers.initIframily(constants.FRAME_TYPE_PARENT, {
                    iframilyVarName: 'iframily1',
                    id: 'testId-1'
                });
                await helpers.initIframily(constants.FRAME_TYPE_PARENT, {
                    iframilyVarName: 'iframily2',
                    id: 'testId-2'
                });

                await helpers.sendMessage(constants.FRAME_TYPE_CHILD, { text: 'hi parent 1!' });

                let messagesFromChildParent1 = await helpers.waitForMessages(constants.FRAME_TYPE_PARENT, 1, { id: 'testId-1' });
                expect(messagesFromChildParent1[0].text).toBe('hi parent 1!');

                let messagesFromChildParent2 = await helpers.getMessages(constants.FRAME_TYPE_PARENT, { id: 'testId-2' });
                expect(messagesFromChildParent2).toHaveLength(0);
            });

            test('should send to correct parent id (parent that should receive the messages was inited second).', async () => {
                await helpers.initIframily(constants.FRAME_TYPE_CHILD, {
                    id: 'testId-1'
                });
                await helpers.initIframily(constants.FRAME_TYPE_PARENT, {
                    iframilyVarName: 'iframily2',
                    id: 'testId-2'
                });
                await helpers.initIframily(constants.FRAME_TYPE_PARENT, {
                    iframilyVarName: 'iframily1',
                    id: 'testId-1'
                });

                await helpers.sendMessage(constants.FRAME_TYPE_CHILD, { text: 'hi parent 1!' });

                let messagesFromChildParent1 = await helpers.waitForMessages(constants.FRAME_TYPE_PARENT, 1, { id: 'testId-1' });
                expect(messagesFromChildParent1[0].text).toBe('hi parent 1!');

                let messagesFromChildParent2 = await helpers.getMessages(constants.FRAME_TYPE_PARENT, { id: 'testId-2' });
                expect(messagesFromChildParent2).toHaveLength(0);
            });
        });
    });

    describe('general', () => {
        test('should get correct id in getter', async() => {
            let varName = 'idTest';
            let uniqueId = 'uniqueId';

            await helpers.initIframily(constants.FRAME_TYPE_PARENT, { id: uniqueId, iframilyVarName: varName });
            let parentFrame = helpers.getFrame(constants.FRAME_TYPE_PARENT);
            let id = await parentFrame.evaluate((_varName) => {
                return window[_varName].id;
            }, varName);

            expect(id).toBe(uniqueId);
        });

        test('should invoke onPairedHandler() and onDisposedHandler()', async () => {
            await helpers.initIframily(constants.FRAME_TYPE_PARENT);
            await helpers.initIframily(constants.FRAME_TYPE_CHILD);

            let pairedCountParent = await helpers.getPairedCount(constants.FRAME_TYPE_PARENT);
            let pairedCountChild = await helpers.getPairedCount(constants.FRAME_TYPE_CHILD);
            expect(pairedCountParent).toBe(1);
            expect(pairedCountChild).toBe(1);

            let disposedCountParent = await helpers.getDisposedCount(constants.FRAME_TYPE_PARENT);
            let disposedCountChild = await helpers.getDisposedCount(constants.FRAME_TYPE_CHILD);
            expect(disposedCountParent).toBe(0);
            expect(disposedCountChild).toBe(0);

            await helpers.dispose(constants.FRAME_TYPE_PARENT);
            await helpers.dispose(constants.FRAME_TYPE_CHILD);
            disposedCountParent = await helpers.getDisposedCount(constants.FRAME_TYPE_PARENT);
            disposedCountChild = await helpers.getDisposedCount(constants.FRAME_TYPE_CHILD);
            expect(disposedCountParent).toBe(1);
            expect(disposedCountChild).toBe(1);
        });

        test('targetOrigin must be specified and must be string', async () => {
            await helpers.wrapConsoleError(constants.FRAME_TYPE_PARENT);

            let parentFrame = helpers.getFrame(constants.FRAME_TYPE_PARENT);
            await parentFrame.evaluate(() => {
                window.Iframily.initParent('someId');
                window.Iframily.initParent('someId', null);
                window.Iframily.initParent('someId', '');

                // This check is mostly for backward compatibility with older iframily version where the 2nd argument was the message handler.
                window.Iframily.initParent('someId', function() {});
            });

            let errors = await helpers.getConsoleErrors(constants.FRAME_TYPE_PARENT);
            expect(errors).toHaveLength(4);
            expect(errors[0][0]).toBe(`[Iframily] - Missing "targetOrigin" argument, not initing "someId" iframily id.`);
            expect(errors[1][0]).toBe(`[Iframily] - Missing "targetOrigin" argument, not initing "someId" iframily id.`);
            expect(errors[2][0]).toBe(`[Iframily] - Missing "targetOrigin" argument, not initing "someId" iframily id.`);
            expect(errors[3][0]).toBe(`[Iframily] - "targetOrigin" is of type function but must be of type string, not initing "someId" iframily id.`);
        });

        test('cannot use "*" (wildcard) as targetOrigin', async () => {
            await helpers.wrapConsoleError(constants.FRAME_TYPE_PARENT);

            let parentFrame = helpers.getFrame(constants.FRAME_TYPE_PARENT);
            await parentFrame.evaluate(() => {
                window.Iframily.initParent('someId', '*');
            });

            let errors = await helpers.getConsoleErrors(constants.FRAME_TYPE_PARENT);
            expect(errors).toHaveLength(1);
            expect(errors[0][0]).toBe(`[Iframily] - "*" (wildcard) is not allowed for "targetOrigin" argument. If you are sure about what you are doing, use "DANGEROUSLY_SET_WILDCARD".`);
        });

        test('should use targetOrigin if specified', async () => {
            await helpers.initIframily(constants.FRAME_TYPE_PARENT, { targetOrigin: ORIGIN });
            await helpers.initIframily(constants.FRAME_TYPE_CHILD, { targetOrigin: ORIGIN });

            let pairedCountParent = await helpers.getPairedCount(constants.FRAME_TYPE_PARENT);
            let pairedCountChild = await helpers.getPairedCount(constants.FRAME_TYPE_CHILD);
            expect(pairedCountParent).toBe(1);
            expect(pairedCountChild).toBe(1);

            await helpers.sendMessage(constants.FRAME_TYPE_PARENT, { text: 'hi child!' });
            let messagesFromParent = await helpers.waitForMessages(constants.FRAME_TYPE_CHILD, 1);
            expect(messagesFromParent[0].text).toBe('hi child!');

            await helpers.sendMessage(constants.FRAME_TYPE_CHILD, { text: 'hi parent!' });
            let messagesFromChild = await helpers.waitForMessages(constants.FRAME_TYPE_PARENT, 1);
            expect(messagesFromChild[0].text).toBe('hi parent!');

            await helpers.initIframily(constants.FRAME_TYPE_PARENT, { id: 'no-match', targetOrigin: 'http://nada.com' });
            await helpers.initIframily(constants.FRAME_TYPE_CHILD, { id: 'no-match', targetOrigin: 'http://gornisht.com' });
            pairedCountParent = await helpers.getPairedCount(constants.FRAME_TYPE_PARENT, { id: 'no-match' });
            pairedCountChild = await helpers.getPairedCount(constants.FRAME_TYPE_CHILD, { id: 'no-match' });
            expect(pairedCountParent).toBe(0);
            expect(pairedCountChild).toBe(0);
        });

        test('should identify iframily messages using isIframilyMessage()', async () => {
            let parentFrame = helpers.getFrame(constants.FRAME_TYPE_PARENT);
            let childFrame = helpers.getFrame(constants.FRAME_TYPE_CHILD);
            await parentFrame.evaluate(() => {
                window.iframilyMessagesCount = 0;
                window.nonIframilyMessagesCount = 0;

                window.addEventListener('message', (event) => {
                    if (window.Iframily.isIframilyMessage(event)) {
                        window.iframilyMessagesCount++;
                    } else {
                        window.nonIframilyMessagesCount++;
                    }
                });
            });
            await childFrame.evaluate(() => {
                window.iframilyMessagesCount = 0;
                window.nonIframilyMessagesCount = 0;

                window.addEventListener('message', (event) => {
                    if (window.Iframily.isIframilyMessage(event)) {
                        window.iframilyMessagesCount++;
                    } else {
                        window.nonIframilyMessagesCount++;
                    }
                });
            });

            await helpers.initIframily(constants.FRAME_TYPE_PARENT);
            await helpers.initIframily(constants.FRAME_TYPE_CHILD);

            // The init messages.
            let iframilyMessagesCountParent = await parentFrame.evaluate(() => window.iframilyMessagesCount);
            let iframilyMessagesCountChild = await childFrame.evaluate(() => window.iframilyMessagesCount);
            expect(iframilyMessagesCountParent).toBe(1);
            expect(iframilyMessagesCountChild).toBe(1);

            await helpers.sendMessage(constants.FRAME_TYPE_PARENT, 'me me me parent');
            await helpers.sendMessage(constants.FRAME_TYPE_CHILD, 'me me me child');

            iframilyMessagesCountParent = await parentFrame.evaluate(() => window.iframilyMessagesCount);
            iframilyMessagesCountChild = await childFrame.evaluate(() => window.iframilyMessagesCount);
            expect(iframilyMessagesCountParent).toBe(3); // 2 new messages because each message sent also sends a response.
            expect(iframilyMessagesCountChild).toBe(3); // 2 new messages because each message sent also sends a response.

            await parentFrame.evaluate(() => {
                let childFrameEl = document.getElementsByTagName('iframe')[0];
                childFrameEl.contentWindow.postMessage('not iframily parent');
            });
            await childFrame.evaluate(() => {
                window.parent.postMessage('not iframily child');
            });

            let nonIframilyMessagesCountParent = await parentFrame.evaluate(() => window.nonIframilyMessagesCount);
            let nonIframilyMessagesCountChild = await childFrame.evaluate(() => window.nonIframilyMessagesCount);
            expect(nonIframilyMessagesCountParent).toBe(1);
            expect(nonIframilyMessagesCountChild).toBe(1);
            iframilyMessagesCountParent = await parentFrame.evaluate(() => window.iframilyMessagesCount);
            iframilyMessagesCountChild = await childFrame.evaluate(() => window.iframilyMessagesCount);
            expect(iframilyMessagesCountParent).toBe(3);
            expect(iframilyMessagesCountChild).toBe(3);
        });
    });
});
