/* eslint-disable max-len */
/* eslint-disable no-magic-numbers */
'use strict';

const fs = require('fs');
const path = require('path');
const _ = require('lodash');

const constants = require('./constants.js');
const helpers = require('./helpers.js');

describe('advanced', () => {
    beforeEach(async () => {
        await page.goto('http://localhost:9135/test/public/basic/parent.html');

        helpers.resetFrames();
        helpers.setFrame(page, constants.FRAME_TYPE_PARENT);
        helpers.setFrame(page.frames().find(frame => frame.name() === 'childFrame'), constants.FRAME_TYPE_CHILD);
    });

    test('cannot create parent/child with same id', async () => {
        await helpers.wrapConsoleError(constants.FRAME_TYPE_PARENT);
        await helpers.wrapConsoleError(constants.FRAME_TYPE_CHILD);

        let errorsParent = await helpers.getConsoleErrors(constants.FRAME_TYPE_PARENT);
        expect(errorsParent).toHaveLength(0);

        await helpers.initIframily(constants.FRAME_TYPE_PARENT);
        await helpers.initIframily(constants.FRAME_TYPE_PARENT);
        errorsParent = await helpers.getConsoleErrors(constants.FRAME_TYPE_PARENT);
        expect(errorsParent).toHaveLength(1);
        expect(errorsParent[0][0]).toBe(`[Iframily] - A parent iframily with id "${constants.DEFAULT_FRAMILY_ID}" was already inited, please use another id or dispose the existing one first.`);

        let errorsChild = await helpers.getConsoleErrors(constants.FRAME_TYPE_CHILD);
        expect(errorsChild).toHaveLength(0);

        await helpers.initIframily(constants.FRAME_TYPE_CHILD);
        await helpers.initIframily(constants.FRAME_TYPE_CHILD);
        errorsChild = await helpers.getConsoleErrors(constants.FRAME_TYPE_CHILD);
        expect(errorsChild).toHaveLength(1);
        expect(errorsChild[0][0]).toBe(`[Iframily] - A child iframily with id "${constants.DEFAULT_FRAMILY_ID}" was already inited, please use another id or dispose the existing one first.`);
    });

    test('can create iframilies using disposed iframilies ids', async () => {
        await helpers.wrapConsoleError(constants.FRAME_TYPE_PARENT);
        await helpers.wrapConsoleError(constants.FRAME_TYPE_CHILD);

        let errorsParent = await helpers.getConsoleErrors(constants.FRAME_TYPE_PARENT);
        let errorsChild = await helpers.getConsoleErrors(constants.FRAME_TYPE_CHILD);

        await helpers.initIframily(constants.FRAME_TYPE_PARENT);
        await helpers.initIframily(constants.FRAME_TYPE_CHILD);

        await helpers.dispose(constants.FRAME_TYPE_PARENT);
        await helpers.initIframily(constants.FRAME_TYPE_PARENT);
        expect(errorsParent).toHaveLength(0);

        await helpers.dispose(constants.FRAME_TYPE_CHILD);
        await helpers.initIframily(constants.FRAME_TYPE_CHILD);
        expect(errorsChild).toHaveLength(0);

        await helpers.sendMessage(constants.FRAME_TYPE_PARENT, { text: 'hi child!' });
        let messagesFromParent = await helpers.waitForMessages(constants.FRAME_TYPE_CHILD, 1);
        expect(messagesFromParent[0].text).toBe('hi child!');

        await helpers.sendMessage(constants.FRAME_TYPE_CHILD, { text: 'hi parent!' });
        let messagesFromChild = await helpers.waitForMessages(constants.FRAME_TYPE_PARENT, 1);
        expect(messagesFromChild[0].text).toBe('hi parent!');
    });

    // eslint-disable-next-line max-statements
    test('various msg objects supported', async () => {
        await helpers.initIframily(constants.FRAME_TYPE_PARENT);
        await helpers.initIframily(constants.FRAME_TYPE_CHILD);

        let numVal = 15;
        let trueVal = true;
        let falseVal = false;
        let stringVal = 'meow 😸';
        let nullVal = null;
        let simpleObjVal = { objProp: 'objProp' };
        let arrayVal = [numVal, trueVal, falseVal, stringVal, nullVal, simpleObjVal];
        let objVal = {
            num: numVal,
            boolTrue: trueVal,
            boolFalse: falseVal,
            string: stringVal,
            null: nullVal,
            array: arrayVal
        };
        let nestedObjVal = {
            meow1: 'meow1',
            nestedObj: {
                meow2: 'meow2'
            }
        };

        helpers.sendMessage(constants.FRAME_TYPE_PARENT, numVal);
        helpers.sendMessage(constants.FRAME_TYPE_PARENT, trueVal);
        helpers.sendMessage(constants.FRAME_TYPE_PARENT, falseVal);
        helpers.sendMessage(constants.FRAME_TYPE_PARENT, stringVal);
        helpers.sendMessage(constants.FRAME_TYPE_PARENT, nullVal);
        helpers.sendMessage(constants.FRAME_TYPE_PARENT, arrayVal);
        helpers.sendMessage(constants.FRAME_TYPE_PARENT, objVal);
        helpers.sendMessage(constants.FRAME_TYPE_PARENT, nestedObjVal);

        let messagesFromParent = await helpers.waitForMessages(constants.FRAME_TYPE_CHILD, 8);
        expect(messagesFromParent[0]).toBe(numVal);
        expect(messagesFromParent[1]).toBe(trueVal);
        expect(messagesFromParent[2]).toBe(falseVal);
        expect(messagesFromParent[3]).toBe(stringVal);
        expect(messagesFromParent[4]).toBe(nullVal);
        expect(_.isEqual(messagesFromParent[5], arrayVal)).toBe(true);
        expect(_.isEqual(messagesFromParent[6], objVal)).toBe(true);
        expect(_.isEqual(messagesFromParent[7], nestedObjVal)).toBe(true);

        // NOTE: Testing 'undefined' separately due to serialization behavior of it in an array
        // NOTE: https://github.com/puppeteer/puppeteer/issues/1510
        let parentFrame = helpers.getFrame(constants.FRAME_TYPE_PARENT);
        let childFrame = helpers.getFrame(constants.FRAME_TYPE_CHILD);
        await parentFrame.evaluate(() => {
            window.undefinedMessagesReceived = [];
            window.iframilyUndefinedTest = window.Iframily.initParent('undefined', (msg) => {
                window.undefinedMessagesReceived.push(msg);
            });
        });
        await childFrame.evaluate(() => {
            window.undefinedMessagesReceived = [];
            window.iframilyUndefinedTest = window.Iframily.initChild('undefined', (msg) => {
                window.undefinedMessagesReceived.push(msg);
            });
        });
        await parentFrame.evaluate(() => {
            window.iframilyUndefinedTest.sendMessage(undefined);
        });
        await childFrame.waitForFunction(() => {
            return window.undefinedMessagesReceived.length === 1;
        });
        let undefinedMessageFromParent = await childFrame.evaluate(() => {
            return window.undefinedMessagesReceived[0];
        });
        expect(undefinedMessageFromParent).toBe(undefined);
        await parentFrame.evaluate(() => {
            window.iframilyUndefinedTest.sendMessage([undefined]);
        });
        await childFrame.waitForFunction(() => {
            return window.undefinedMessagesReceived.length === 2;
        });
        let undefinedArrMessageFromParent = await childFrame.evaluate(() => {
            return window.undefinedMessagesReceived[1];
        });
        expect(_.isEqual(undefinedArrMessageFromParent, [null])).toBe(true);
    });

    test('unserialiazble message error', async () => {
        let parentFrame = helpers.getFrame(constants.FRAME_TYPE_PARENT);
        let childFrame = helpers.getFrame(constants.FRAME_TYPE_CHILD);
        await parentFrame.evaluate(() => {
            window.iframily = window.Iframily.initParent('someId');
        });
        await childFrame.evaluate(() => {
            window.iframily = window.Iframily.initChild('someId');
        });

        await helpers.wrapConsoleError(constants.FRAME_TYPE_PARENT);
        let errorsParent = await helpers.getConsoleErrors(constants.FRAME_TYPE_PARENT);
        expect(errorsParent).toHaveLength(0);

        await parentFrame.evaluate(() => {
            window.iframily.sendMessage({ fn: function() {} });
        });
        errorsParent = await helpers.getConsoleErrors(constants.FRAME_TYPE_PARENT);
        expect(errorsParent).toHaveLength(1);
        expect(errorsParent[0][0]).toBe('[Iframily] - Error when posting message:');
        expect(errorsParent[0][1].stack).toContain('Error: Failed to execute \'postMessage\' on \'Window\': function () {} could not be cloned.');
    });

    test('cross domain iframes should work', async () => {
        await page.goto('http://sub1.domain1iframily.com:9135/test/public/crossdomain/parent.html');
        helpers.resetFrames();
        helpers.setFrame(page, constants.FRAME_TYPE_PARENT);
        helpers.setFrame(page.frames().find(frame => frame.name() === 'childFrame'), constants.FRAME_TYPE_CHILD);

        await helpers.initIframily(constants.FRAME_TYPE_PARENT);
        await helpers.initIframily(constants.FRAME_TYPE_CHILD);

        await helpers.sendMessage(constants.FRAME_TYPE_PARENT, 'hi from parent');
        await helpers.sendMessage(constants.FRAME_TYPE_CHILD, 'hi from child');

        let messagesFromChild = await helpers.waitForMessages(constants.FRAME_TYPE_PARENT, 1);
        let messagesFromParent = await helpers.waitForMessages(constants.FRAME_TYPE_CHILD, 1);

        expect(messagesFromChild[0]).toBe('hi from child');
        expect(messagesFromParent[0]).toBe('hi from parent');
    });

    test('benchmark messages sending', async () => {
        jest.setTimeout(10000);

        let messagesAmount = 10000;

        // Obviously, Iframily has some overhead versus native "postMessage" but it should not be bigger than defined here.
        // NOTE: Most of the performance overhead is due to sending a response to every message, even if the message handler
        // NOTE: did not return any value ("undefined").
        // NOTE: The implications of changing this behaviour will be zombie callbacks on the sender's side which will never clear.
        let overheadMultiplier = 7;

        let parentFrame = helpers.getFrame(constants.FRAME_TYPE_PARENT);
        let childFrame = helpers.getFrame(constants.FRAME_TYPE_CHILD);

        // NATIVE

        await parentFrame.evaluate(() => {
            window.nativeMessagesReceived = [];
            window.msgHandler = (msg) => {
                window.nativeMessagesReceived.push(msg);
            };
            window.addEventListener('message', window.msgHandler);
        });
        await childFrame.evaluate(() => {
            window.nativeMessagesReceived = [];
            window.msgHandler = (msg) => {
                window.nativeMessagesReceived.push(msg);
            };
            window.addEventListener('message', window.msgHandler);
        });

        let preNativeParentTime = new Date();
        await parentFrame.evaluate((_messagesAmount) => {
            for (let i = 0; i < _messagesAmount; i++) {
                window.frames[0].postMessage(`parent to child msg ${i}`);
            }
        }, messagesAmount);
        await childFrame.waitForFunction((_messagesAmount) => {
            return window.nativeMessagesReceived.length === _messagesAmount;
        }, {}, messagesAmount);
        let nativeParentTime = new Date() - preNativeParentTime;

        let preNativeChildTime = new Date();
        await childFrame.evaluate((_messagesAmount) => {
            for (let i = 0; i < _messagesAmount; i++) {
                window.parent.postMessage(`child to parent msg ${i}`);
            }
        }, messagesAmount);
        await parentFrame.waitForFunction((_messagesAmount) => {
            return window.nativeMessagesReceived.length === _messagesAmount;
        }, {}, messagesAmount);
        let nativeChildTime = new Date() - preNativeChildTime;

        // FRAMILY

        await parentFrame.evaluate(() => {
            window.removeEventListener('message', window.msgHandler);

            window.messagesReceived = [];
            window.iframily = window.Iframily.initParent('someId', (msg) => {
                window.messagesReceived.push(msg);
            });
        });
        await childFrame.evaluate(() => {
            window.removeEventListener('message', window.msgHandler);

            window.messagesReceived = [];
            window.iframily = window.Iframily.initChild('someId', (msg) => {
                window.messagesReceived.push(msg);
            });
        });

        let preIframilyParentTime = new Date();
        await parentFrame.evaluate((_messagesAmount) => {
            for (let i = 0; i < _messagesAmount; i++) {
                window.iframily.sendMessage(`parent to child msg ${i}`);
            }
        }, messagesAmount);
        await childFrame.waitForFunction((_messagesAmount) => {
            return window.messagesReceived.length === _messagesAmount;
        }, {}, messagesAmount);
        let iframilyParentTime = new Date() - preIframilyParentTime;
        expect(iframilyParentTime).toBeLessThan(nativeParentTime * overheadMultiplier);

        let preChildTime = new Date();
        await childFrame.evaluate((_messagesAmount) => {
            for (let i = 0; i < _messagesAmount; i++) {
                window.iframily.sendMessage(`child to parent msg ${i}`);
            }
        }, messagesAmount);
        await parentFrame.waitForFunction((_messagesAmount) => {
            return window.messagesReceived.length === _messagesAmount;
        }, {}, messagesAmount);
        let iframilyChildTime = new Date() - preChildTime;
        expect(iframilyChildTime).toBeLessThan(nativeChildTime * overheadMultiplier);
    });

    test('artifact size limit', () => {
        let bundlePath = path.join('dist', 'iframily.min.js');
        let content = fs.readFileSync(bundlePath);
        let stats = fs.lstatSync(bundlePath);

        let isDevelopmentBundle = content.toString().includes('/*! DEVELOPMENT BUNDLE */');
        expect(stats.size).toBeLessThan(isDevelopmentBundle ? 30000 : 12000);
    });

    test('multiple child frames', async () => {
        await page.goto('http://localhost:9135/test/public/multiple_frames/parent.html');
        helpers.resetFrames();
        helpers.setFrame(page, constants.FRAME_TYPE_PARENT);
        helpers.setFrame(page.frames().find(frame => frame.name() === 'childFrame1'), constants.FRAME_TYPE_CHILD1);
        helpers.setFrame(page.frames().find(frame => frame.name() === 'childFrame2'), constants.FRAME_TYPE_CHILD2);

        await helpers.initIframily(constants.FRAME_TYPE_PARENT, { iframilyVarName: 'parent1', id: 'child1' });
        await helpers.initIframily(constants.FRAME_TYPE_PARENT, { iframilyVarName: 'parent2', id: 'child2' });
        await helpers.initIframily(constants.FRAME_TYPE_CHILD1, { id: 'child1' });
        await helpers.initIframily(constants.FRAME_TYPE_CHILD2, { id: 'child2' });

        await helpers.sendMessage(constants.FRAME_TYPE_PARENT, 'hi child 1', { iframilyVarName: 'parent1' });
        await helpers.sendMessage(constants.FRAME_TYPE_PARENT, 'hi child 2', { iframilyVarName: 'parent2' });
        await helpers.sendMessage(constants.FRAME_TYPE_CHILD1, 'hi from child 1');
        await helpers.sendMessage(constants.FRAME_TYPE_CHILD2, 'hi from child 2');

        let messagesFromParentToChild1 = await helpers.waitForMessages(constants.FRAME_TYPE_CHILD1, 1, { id: 'child1' });
        let messagesFromParentToChild2 = await helpers.waitForMessages(constants.FRAME_TYPE_CHILD2, 1, { id: 'child2' });
        let messagesFromChild1 = await helpers.waitForMessages(constants.FRAME_TYPE_PARENT, 1, { id: 'child1' });
        let messagesFromChild2 = await helpers.waitForMessages(constants.FRAME_TYPE_PARENT, 1, { id: 'child2' });

        expect(messagesFromParentToChild1[0]).toBe('hi child 1');
        expect(messagesFromParentToChild2[0]).toBe('hi child 2');
        expect(messagesFromChild1[0]).toBe('hi from child 1');
        expect(messagesFromChild2[0]).toBe('hi from child 2');
    });

    test('parent - child - childOfChild: relay messages, make sure parent and childOfChild don\'t communicate', async () => {
        await page.goto('http://localhost:9135/test/public/multiple_frames/parent.html');
        helpers.resetFrames();
        helpers.setFrame(page, constants.FRAME_TYPE_PARENT);
        helpers.setFrame(page.frames().find(frame => frame.name() === 'childFrame2'), constants.FRAME_TYPE_CHILD2);
        helpers.setFrame(page.frames().find(frame => frame.name() === 'childFrame2innerChild'), constants.FRAME_TYPE_CHILD2_INNER_CHILD);

        let parentFrame = helpers.getFrame(constants.FRAME_TYPE_PARENT);
        let child2Frame = helpers.getFrame(constants.FRAME_TYPE_CHILD2);
        let child2innerChildFrame = helpers.getFrame(constants.FRAME_TYPE_CHILD2_INNER_CHILD);

        await parentFrame.evaluate(() => {
            window.messagesReceivedFromChild2 = [];
            window.parentIframily = window.Iframily.initParent('parent-child2', (msg) => {
                window.messagesReceivedFromChild2.push(msg);
            });
        });
        await child2Frame.evaluate(() => {
            window.messagesReceivedFromChild2Parent = [];
            window.child2ChildIframily = window.Iframily.initChild('parent-child2', (msg) => {
                window.messagesReceivedFromChild2Parent.push(msg);

                // Pass down to inner child.
                window.child2ParentIframily.sendMessage(msg);
            });
        });
        await child2Frame.evaluate(() => {
            window.messagesReceivedFromChild2InnerChild = [];
            window.child2ParentIframily = window.Iframily.initParent('child2-child2innerChild', (msg) => {
                window.messagesReceivedFromChild2InnerChild.push(msg);

                // Pass up to parent.
                window.child2ChildIframily.sendMessage(msg);
            });
        });
        await child2innerChildFrame.evaluate(() => {
            window.messagesReceivedFromChild2InnerChildParent = [];
            window.child2InnerChildChildIframily = window.Iframily.initChild('child2-child2innerChild', (msg) => {
                window.messagesReceivedFromChild2InnerChildParent.push(msg);
            });
        });

        await parentFrame.evaluate(() => {
            window.parentIframily.sendMessage('hi from top frame parent');
        });
        await child2Frame.waitForFunction(() => {
            return window.messagesReceivedFromChild2Parent.length === 1;
        });
        await child2innerChildFrame.waitForFunction(() => {
            return window.messagesReceivedFromChild2InnerChildParent.length === 1;
        });
        let messagesReceivedFromChild2Parent = await child2Frame.evaluate(() => {
            return window.messagesReceivedFromChild2Parent;
        });
        let messagesReceivedFromChild2InnerChildParent = await child2innerChildFrame.evaluate(() => {
            return window.messagesReceivedFromChild2InnerChildParent;
        });
        expect(messagesReceivedFromChild2Parent[0]).toBe('hi from top frame parent');
        expect(messagesReceivedFromChild2InnerChildParent[0]).toBe('hi from top frame parent');

        await child2innerChildFrame.evaluate(() => {
            window.child2InnerChildChildIframily.sendMessage('hi from bottom frame child');
        });
        await child2Frame.waitForFunction(() => {
            return window.messagesReceivedFromChild2InnerChild.length === 1;
        });
        await parentFrame.waitForFunction(() => {
            return window.messagesReceivedFromChild2.length === 1;
        });
        let messagesReceivedFromChild2InnerChild = await child2Frame.evaluate(() => {
            return window.messagesReceivedFromChild2InnerChild;
        });
        let messagesReceivedFromChild2 = await parentFrame.evaluate(() => {
            return window.messagesReceivedFromChild2;
        });
        expect(messagesReceivedFromChild2InnerChild[0]).toBe('hi from bottom frame child');
        expect(messagesReceivedFromChild2[0]).toBe('hi from bottom frame child');
    });

    test('parent and child in same frame will not connect', async () => {
        let parentFrame = helpers.getFrame(constants.FRAME_TYPE_PARENT);
        await parentFrame.evaluate(() => {
            window.parentIframilyMessagesReceived = [];
            window.parentIframily = window.Iframily.initParent('someId', (msg) => {
                window.parentIframilyMessagesReceived.push(msg);
            });
        });
        await parentFrame.evaluate(() => {
            window.childIframilyMessagesReceived = [];
            window.childIframily = window.Iframily.initChild('someId', (msg) => {
                window.childIframilyMessagesReceived.push(msg);
            });
        });

        await parentFrame.evaluate(() => {
            window.parentIframily.sendMessage('meow');
            window.childIframily.sendMessage('meow');
        });

        await new Promise((resolve) => {
            setTimeout(resolve, 1000);
        });

        let messagesReceivedArr = await parentFrame.evaluate(() => {
            return [window.parentIframilyMessagesReceived, window.childIframilyMessagesReceived];
        });

        expect(messagesReceivedArr[0]).toHaveLength(0);
        expect(messagesReceivedArr[1]).toHaveLength(0);
    });
});
