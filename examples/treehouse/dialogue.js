'use strict';

let dialogue = {
    'root': [
        {
            'text': 'Everything is going according to plan.',
            'replyId': '0_1. Dad: Everything is going according to plan.'
        }
    ],
    '0_1. Dad: Everything is going according to plan.': [
        {
            'text': 'According to plan, what?',
            'replyId': '1_Kid: According to plan, what?'
        }
    ],
    '1_Kid: According to plan, what?': [
        {
            'text': 'According to plan, SIR!',
            'replyId': '2_Dad: According to plan, sir!'
        }
    ],
    '2_Dad: According to plan, sir!': [
        {
            'text': 'Excellent news!<br/>Prepare for the next step.',
            'replyId': '3_Kid: Excellent news! Prepare for the next step.'
        }
    ],
    '3_Kid: Excellent news! Prepare for the next step.': [
        {
            'text': 'Yes, sir. Shall I start with the mother?',
            'replyId': '4_Dad: Yes, sir. Shall I start with the mother?'
        },
        {
            'text': 'Everything is already set up, sir.',
            'replyId': '11_Dad: Everything is already set up, sir.'
        },
        {
            'text': 'Are you sure we are ready?',
            'replyId': '18_Dad: Are you sure we are ready?'
        }
    ],
    '4_Dad: Yes, sir. Shall I start with the mother?': [
        {
            'text': 'Yes. She will be a great asset to us.',
            'replyId': '5_Kid: Yes. She will be a great asset to us.'
        },
        {
            'text': 'No. The daughter is smarter. Start with her. ',
            'replyId': '6_Kid: No. The daughter is smarter. Start with her. '
        },
        {
            'text': 'Start with whomever you choose. Just be done by morning.',
            'replyId': '7_Kid: Start with whomever you choose. Just be done by morning.'
        }
    ],
    '7_Kid: Start with whomever you choose. Just be done by morning.': [
        {
            'text': 'Yes, sir. Soon all of humanity will be turned, and our lost home planet of Zorg will live again on earth!',
            'replyId': '8_Dad: Yes, sir. Soon all of humanity will be turned, and our lost home planet of Zorg will live again on earth!'
        }
    ],
    '8_Dad: Yes, sir. Soon all of humanity will be turned, and our lost home planet of Zorg will live again on earth!': [
        {
            'text': 'You have served me well, my loyal first officer, and shall be greatly rewarded.',
            'replyId': '9_Kid: You have served me well, my loyal first officer, and shall be greatly rewarded.'
        }
    ],
    '9_Kid: You have served me well, my loyal first officer, and shall be greatly rewarded.': [
        {
            'text': 'This is the last time I let you watch Invasion of the Body Snatchers, sir!',
            'replyId': '21_Kid: Muhahahaha'
        }
    ],
    '11_Dad: Everything is already set up, sir.': [
        {
            'text': 'Good. The daughter goes first, then the mother.',
            'replyId': '12_Kid: Good. The daughter goes first, then the mother.'
        },
        {
            'text': 'Are you sure everything is in place?',
            'replyId': '13_Kid: Are you sure everything is in place?'
        },
        {
            'text': 'Wonderful. We have no time to waste.',
            'replyId': '14_Kid: Wonderful. We have no time to waste.'
        }
    ],
    '14_Kid: Wonderful. We have no time to waste.': [
        {
            'text': 'Yes, sir. Soon all of humanity will be turned, and our lost home planet of Zorg will live again on earth!',
            'replyId': '15_Dad: Yes, sir. Soon all of humanity will be turned, and our lost home planet of Zorg will live again on earth!'
        }
    ],
    '15_Dad: Yes, sir. Soon all of humanity will be turned, and our lost home planet of Zorg will live again on earth!': [
        {
            'text': 'You have served me well, my loyal first officer, and shall be greatly rewarded.',
            'replyId': '16_Kid: You have served me well, my loyal first officer, and shall be greatly rewarded.'
        }
    ],
    '16_Kid: You have served me well, my loyal first officer, and shall be greatly rewarded.': [
        {
            'text': 'I require nothing more than the honor of fulfilling our mission.',
            'replyId': '21_Kid: Muhahahaha'
        }
    ],
    '18_Dad: Are you sure we are ready?': [
        {
            'text': 'Yes. Soon all of humanity will be turned, and our lost home planet of Zorg will live again on earth!',
            'replyId': '19_Kid: Yes. Soon all of humanity will be turned, and our lost home planet of Zorg will live again on earth!'
        }
    ],
    '19_Kid: Yes. Soon all of humanity will be turned, and our lost home planet of Zorg will live again on earth!': [
        {
            'text': 'You are most wise and powerful, sir. The people of Zorg are forever in your debt.',
            'replyId': '21_Kid: Muhahahaha'
        }
    ],
    '21_Kid: Muhahahaha': [
        {
            'text': ' Muhahahaha',
            'replyId': ''
        }
    ]
};

window.getDialogueOptions = function(id, onChoose) {
    let optionButtons = [];
    if (dialogue[id]) {
        optionButtons = dialogue[id].map(dialogueOption => {
            let optionButton = document.createElement('button');
            optionButton.setAttribute('data-replyId', dialogueOption.replyId);
            optionButton.innerHTML = `<span>${dialogueOption.text}</span>`;
            optionButton.addEventListener('click', () => onChoose(dialogueOption.replyId));

            return optionButton;
        });
    }

    return optionButtons;
};
