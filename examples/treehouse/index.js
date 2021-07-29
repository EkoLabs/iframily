'use strict';

let parentIframily = window.Iframily.initParent('treehouse', window.location.origin);

document.addEventListener('DOMContentLoaded', () => {
    setupDialogue('root');

    document.querySelector('.end button').addEventListener('click', () => window.location.reload());
});

function setupDialogue(dialogueId) {
    // This is the initial dialogue which starts it all
    let dialogOptions = window.getDialogueOptions(dialogueId, parentReplyId => {
        setSelectedMessage(parentReplyId);
        parentIframily.sendMessage(parentReplyId).then(childReplyId => setupDialogue(childReplyId));
    });

    updateDialogueOptions(dialogOptions);
}

function updateDialogueOptions(optionElements) {
    let dialogueOptionsContainerEl = document.querySelector('.dialogueOptionsContainer');
    dialogueOptionsContainerEl.classList.remove('selected0', 'selected1', 'selected2');
    dialogueOptionsContainerEl.innerHTML = '';

    if (optionElements.length > 0) {
        optionElements.forEach(optionElement => dialogueOptionsContainerEl.appendChild(optionElement));
    } else {
        document.body.classList.add('ended');
    }
}

function setSelectedMessage(replyId) {
    let dialogueOptionsContainerEl = document.querySelector('.dialogueOptionsContainer');
    let optionEl = dialogueOptionsContainerEl.querySelector(`button[data-replyId='${replyId}']`);
    const optionIndex = [...dialogueOptionsContainerEl.children].indexOf(optionEl);
    dialogueOptionsContainerEl.classList.add(`selected${optionIndex}`);
}
