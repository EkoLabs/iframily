'use strict';

const QUESTION_RANDOM_TIME_MIN = 3000;
const QUESTION_RANDOM_TIME_MAX = 30000;
const QUESTION_TIMEOUT = 20000;
const RESPONSE_OF_THE_RESPONSE_DELAY = 1000;

// Keep original questions and a clone to mutate on.
let origQuestions = Object.keys(window.dialogue);
let questionsPool = Array.from(origQuestions);

let prevQuestion;

function getRandomQuestion() {
    let randQuestionIndex = Math.floor(Math.random() * questionsPool.length);
    if (prevQuestion && questionsPool[randQuestionIndex] === prevQuestion) {
        return getRandomQuestion();
    }

    return questionsPool.splice(randQuestionIndex, 1)[0];
}

function autoScroll() {
    let dialogEl = document.querySelector('#dialog');
    let latestNewMessage = [...dialogEl.querySelectorAll('.new')].pop();
    latestNewMessage.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
    });
}

function addMessage(text, showDots, type) {
    return new Promise((resolve) => {
        let newMessageEl = document.querySelector('.message.template').cloneNode(true);
        newMessageEl.classList.remove('template');
        let contentEl = newMessageEl.querySelector('.content');
        contentEl.innerText = text;
        if (type) {
            newMessageEl.classList.add(type);
        }

        document.querySelector('#dialog').appendChild(newMessageEl);

        if (showDots) {
            newMessageEl.classList.add('loading');
            setTimeout(() => {
                newMessageEl.classList.remove('loading');
                autoScroll();
                resolve();
            }, Math.max(1000, text.length * 100));
        } else {
            resolve();
        }
    });
}

function askQuestionInRandomTime() {
    let randTime = Math.random() * (QUESTION_RANDOM_TIME_MAX - QUESTION_RANDOM_TIME_MIN) + QUESTION_RANDOM_TIME_MIN;
    setTimeout(() => {
        let currQuestion = getRandomQuestion();
        prevQuestion = currQuestion;

        addMessage(currQuestion, true, 'new')
            .then(() => {
                let timeoutID;
                window.frameIframily.sendMessage(currQuestion)
                    .then((resp) => {
                        console.log(`${window.frameIframily.id} got response:`, resp);

                        clearTimeout(timeoutID);

                        addMessage(resp, false, 'sent');

                        let responses = window.dialogue[currQuestion];
                        let responseOfTheResponse = responses[resp] || responses.default;

                        return new Promise((resolve) => {
                            setTimeout(() => {
                                addMessage(responseOfTheResponse, true);
                                resolve();
                            }, RESPONSE_OF_THE_RESPONSE_DELAY)
                        })
                    })
                    .catch(() => {
                        console.log(`${window.frameIframily.id} catch (timeout)`);

                        let responses = window.dialogue[currQuestion];
                        let responseOfTheResponse = responses.timeout;
                        return addMessage(responseOfTheResponse, true);
                    })
                    .finally(() => {
                        console.log(`${window.frameIframily.id} finally`);

                        if (questionsPool.length === 0) {
                            questionsPool = Array.from(origQuestions);
                        }

                        askQuestionInRandomTime();
                    });

                timeoutID = setTimeout(() => {
                    window.frameIframily.sendMessage('timeout');
                }, QUESTION_TIMEOUT);
            });
    }, randTime);
}

askQuestionInRandomTime();

// Disable scrolling
window.onwheel = function() {
    return false;
};

document.body.ontouchend = (e) => {
    e.preventDefault();
};
