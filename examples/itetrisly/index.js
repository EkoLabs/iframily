'use strict';

// ------------------------------------------------
// CONSTANTS
// ------------------------------------------------

const BOARD_X_SIZE = 10;
const PIECE_GRID_SIZE = 4;
const NUMBER_OF_BOTTOM_BOARDS = 3;

// ------------------------------------------------
// VARIABLES
// ------------------------------------------------

let parentTopIframily;
let parentBottomIframiliesArr = [];
let currPosX = 0;
let translateValueX = 0;
let doneMessagesCounter = 0;
let bottomContainerEl = document.querySelector('#bottomContainer');
let gameMessageEl = document.querySelector('#gameMessage');
let gamePendingStart = true;
let shouldReloadOnStart = false;

// ------------------------------------------------
// METHODS
// ------------------------------------------------

function initFramilies() {
    // Dispose previous iframilies (important when restarting the game).
    if (parentTopIframily) {
        parentTopIframily.dispose();
    }

    parentBottomIframiliesArr.forEach((parentBottomIframily) => {
        parentBottomIframily.dispose();
    });

    // Iframily connection between this frame and the top tetris.
    parentTopIframily = window.Iframily.initParent('top', window.location.origin, (msg) => {
        if (msg.action === 'drop') {
            drop(msg);
        }
    });

    // Iframily connection between this frame and the bottom tetrises.
    function initParentBottomIframily(id) {
        return window.Iframily.initParent(id, window.location.origin, (msg) => {
            if (msg.action === 'lose') {
                gameMessageEl.innerHTML = 'game over<small>hit space to restart</small>';
                document.body.classList.add("lost");
                document.body.classList.remove("started");

                gamePendingStart = true;
                shouldReloadOnStart = true;
            } else if (msg.action === 'done') {
                // Only when all expected 'done' messages received, relay the message
                // to the top tetris so can start with a new piece.
                doneMessagesCounter--;
                if (doneMessagesCounter === 0) {
                    parentTopIframily.sendMessage(msg);
                }
            } else if (msg.action === 'addScore') {
                parentTopIframily.sendMessage(msg);
            }
        });
    }

    parentBottomIframiliesArr = [
        initParentBottomIframily('bottom-1'),
        initParentBottomIframily('bottom-2'),
        initParentBottomIframily('bottom-3')
    ];
}

function move(dir) {
    let moveVals = { left: -1, right: 1 };
    let moveVal = moveVals[dir];

    currPosX = currPosX + moveVal;
    translateValueX = currPosX * (BOARD_X_SIZE * 2);
    bottomContainerEl.style.transform = `translate(${translateValueX}px, 0px)`;
}

function drop(msg) {
    let current = msg.current;
    let origBlocks = current.type.blocks;
    let currBlock = origBlocks[current.dir];
    let currAbsX = current.x + BOARD_X_SIZE;

    // eslint-disable-next-line no-unused-vars
    let { blocksAbsData, minAbsX, maxAbsX } = getBlocksAbsoluteData(current);

    // Should always start from top y in the bottom frames.
    current.y = 0;

    for (let index = 0; index < NUMBER_OF_BOTTOM_BOARDS; index++) {
        let boardAbsStartX = currPosX + (index * BOARD_X_SIZE);
        let boardAbsEndX = boardAbsStartX + BOARD_X_SIZE;

        if (minAbsX >= boardAbsStartX && maxAbsX < boardAbsEndX) { // Fits entirely in one bottom tetris.
            current.x = (current.x + BOARD_X_SIZE) - boardAbsStartX;

            parentBottomIframiliesArr[index].sendMessage(msg);
            doneMessagesCounter++;
        } else if (boardAbsEndX > minAbsX && boardAbsEndX <= maxAbsX) { // Fits but gets cut off at the right side.
            let splitPosition = boardAbsEndX - currAbsX;

            current.x = BOARD_X_SIZE - PIECE_GRID_SIZE;
            current.type.blocks[current.dir] = current.type.blocksSplit[currBlock][`splitIn${splitPosition}`].left;

            parentBottomIframiliesArr[index].sendMessage(msg);
            doneMessagesCounter++;
        } else if (boardAbsStartX >= minAbsX && boardAbsStartX <= maxAbsX) { // Fits but gets cut off at the left side.
            let splitPosition = boardAbsStartX - currAbsX;

            current.x = 0;
            current.type.blocks[current.dir] = current.type.blocksSplit[currBlock][`splitIn${splitPosition}`].right;

            parentBottomIframiliesArr[index].sendMessage(msg);
            doneMessagesCounter++;
        }
    }

    // Didn't drop to any bottom frame (because nothing was below).
    if (doneMessagesCounter === 0) {
        parentTopIframily.sendMessage({ action: 'done' });
    }
}

function getBlocksAbsoluteData(current) {
    let blocksAbsPos = [];
    let minAbsX = Number.MAX_SAFE_INTEGER;
    let maxAbsX = Number.MIN_SAFE_INTEGER;

    eachblock(current.type, current.x, current.y, current.dir, (x, y) => {
        let xAbsPos = x + BOARD_X_SIZE;
        blocksAbsPos.push({ x: xAbsPos, y: y });
        minAbsX = Math.min(minAbsX, xAbsPos);
        maxAbsX = Math.max(maxAbsX, xAbsPos);
    });

    return {
        blocksAbsPos,
        minAbsX,
        maxAbsX
    };
}

function eachblock(type, x, y, dir, fn) {
    // eslint-disable-next-line one-var
    let bit, row = 0, col = 0, blocks = type.blocks[dir];
    // eslint-disable-next-line no-magic-numbers, no-bitwise
    for (bit = 0x8000; bit > 0; bit = bit >> 1) {
        // eslint-disable-next-line no-bitwise
        if (blocks & bit) {
            fn(x + col, y + row);
        }
        if (++col === 4) {
            col = 0;
            ++row;
        }
    }
}

// ------------------------------------------------
// MAIN LOGIC
// ------------------------------------------------

initFramilies();
document.addEventListener('keydown', keydown, false);

function keydown(e) {
    /* eslint-disable no-magic-numbers */
    switch (e.keyCode) {
        case 32: // Space
            if (gamePendingStart) {
                if (shouldReloadOnStart) {
                    parentTopIframily.sendMessage({ action: 'reload' });
                    parentBottomIframiliesArr.forEach((parentBottomIframily) => {
                        parentBottomIframily.sendMessage({ action: 'reload' });
                    });

                    doneMessagesCounter = 0;
                    initFramilies();
                }

                parentTopIframily.sendMessage({ action: 'start' });
                document.body.classList.remove("ready");
                document.body.classList.remove("lost");
                document.body.classList.add("started");
                gamePendingStart = false;
            }

            e.preventDefault();
            break;

        case 39: // Right
            move('right');

            e.preventDefault();
            break;

        case 37: // Left
            move('left');

            e.preventDefault();
            break;

        case 38: // Up
            parentTopIframily.sendMessage({ action: 'up' });

            e.preventDefault();
            break;

        case 40: // Down
            parentTopIframily.sendMessage({ action: 'down' });
            parentBottomIframiliesArr.forEach((parentBottomIframily) => {
                parentBottomIframily.sendMessage({ action: 'down' });
            });

            e.preventDefault();
            break;

        default:
            break;
    }
    /* eslint-enable no-magic-numbers */
}
