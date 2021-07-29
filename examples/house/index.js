'use strict';

const SHAKE_MESSAGE_TIME = 15000;

let currCharacterSelected;
let responsePromisesMap = {};

['brother_button', 'baby_button', 'sister_button', 'father_button'].forEach((characterBtnId) => {
    document.getElementById(characterBtnId).onclick = (e) => {
        let characterName = characterBtnId.split('_')[0];

        // Deselect all first.
        let characters = document.querySelectorAll('.character');
        characters.forEach(c => c.classList.remove('selected'));

        e.target.classList.add('selected');
        currCharacterSelected = characterName;
    };
});

document.querySelectorAll('.emoji').forEach((emoji) => {
    emoji.addEventListener('click', () => {
        if (currCharacterSelected === 'baby') {
            responsePromisesMap.baby.resolve(emoji.innerText);
        } else if (currCharacterSelected === 'brother') {
            responsePromisesMap.brother.resolve(emoji.innerText);
        } else if (currCharacterSelected === 'father') {
            responsePromisesMap.father.resolve(emoji.innerText);
        } else if (currCharacterSelected === 'sister') {
            responsePromisesMap.sister.resolve(emoji.innerText);
        }
    });
});

function initIframily(id) {
    responsePromisesMap[id] = {
        resolve: () => {},
        reject: () => {}
    };

    window.Iframily.initParent(id, window.location.origin, (msg) => {
        if (msg === 'timeout') {
            responsePromisesMap[id].reject();
            setIsMessageWaiting(id, false);
        } else {
            setIsMessageWaiting(id, true);

            return new Promise((resolve, reject) => {
                responsePromisesMap[id].resolve = resolve;
                responsePromisesMap[id].reject = reject;
            }).finally(() => {
                setIsMessageWaiting(id, false);
            });
        }
    });
}

function setIsMessageWaiting(character, status) {
    let buttonEl = document.getElementById(`${character}_button`);

    if (status) {
        buttonEl.classList.add('message_waiting');
        setTimeout(() => buttonEl.classList.add('shake'), SHAKE_MESSAGE_TIME);
    } else {
        buttonEl.classList.remove('message_waiting');
        buttonEl.classList.remove('shake');
    }
}

initIframily('baby');
initIframily('brother');
initIframily('father');
initIframily('sister');
