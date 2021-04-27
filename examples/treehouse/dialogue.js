function getDialogueOptions(id, onChoose){
    let optionButtons = [];
    if (dialogue[id]) {
        optionButtons = dialogue[id].map(dialogueOption => {
            let optionButton = document.createElement("button");
            optionButton.setAttribute("data-replyId", dialogueOption.replyId)
            optionButton.innerHTML = `<span>${dialogueOption.text}</span>`;
            optionButton.addEventListener("click", () => onChoose(dialogueOption.replyId));

            return optionButton;
        })
    }

    return optionButtons;
}

let dialogue = {
    "root": [
        {
            "text": "1. Hungry?",
            "replyId": "0_1. Hungry?"
        },
        {
            "text": "2. Thirsty?",
            "replyId": "246_2. Thirsty?"
        },
        {
            "text": "3. Tired?",
            "replyId": "314_3. Tired?"
        }
    ],
    "0_1. Hungry?": [
        {
            "text": "Yes! Pizza!",
            "replyId": "1_Yes! Pizza!"
        },
        {
            "text": "Nope.",
            "replyId": "126_Nope."
        },
        {
            "text": "Yes! Fooooood!",
            "replyId": "188_Yes! Fooooood!"
        }
    ],
    "1_Yes! Pizza!": [
        {
            "text": "Nope.",
            "replyId": "2_Nope."
        },
        {
            "text": "Yum!",
            "replyId": "64_Yum!"
        },
        {
            "text": "How about pasta?",
            "replyId": "86_How about pasta?"
        }
    ],
    "2_Nope.": [
        {
            "text": "Ugh!",
            "replyId": "3_Ugh!"
        },
        {
            "text": "Hamburger!",
            "replyId": "35_Hamburger!"
        },
        {
            "text": "You suck!",
            "replyId": "57_You suck!"
        }
    ],
    "3_Ugh!": [
        {
            "text": "Salad?",
            "replyId": "4_Salad?"
        },
        {
            "text": "Soup?",
            "replyId": "21_Soup?"
        },
        {
            "text": "Nothing then!",
            "replyId": "28_Nothing then!"
        }
    ],
    "4_Salad?": [
        {
            "text": "No way!",
            "replyId": "5_No way!"
        },
        {
            "text": "Gross!",
            "replyId": "12_Gross!"
        },
        {
            "text": "Delicious!",
            "replyId": "19_Delicious!"
        }
    ],
    "5_No way!": [
        {
            "text": "Stuffed Cabbage?",
            "replyId": "6_Stuffed Cabbage?"
        },
        {
            "text": "Noodles?",
            "replyId": "8_Noodles?"
        },
        {
            "text": "Starve?",
            "replyId": "10_Starve?"
        }
    ],
    "6_Stuffed Cabbage?": [
        {
            "text": "Yeah, right...",
            "replyId": "7_Yeah, right..."
        }
    ],
    "8_Noodles?": [
        {
            "text": "Ramen! Yay!",
            "replyId": "9_Ramen! Yay!"
        }
    ],
    "10_Starve?": [
        {
            "text": "You’re literally the worst dad.",
            "replyId": "11_You’re literally the worst dad."
        }
    ],
    "12_Gross!": [
        {
            "text": "Starve?",
            "replyId": "13_Starve?"
        },
        {
            "text": "Cry to mommy?",
            "replyId": "15_Cry to mommy?"
        },
        {
            "text": "Burrito?",
            "replyId": "17_Burrito?"
        }
    ],
    "13_Starve?": [
        {
            "text": "Fine! Salad!",
            "replyId": "14_Fine! Salad!"
        }
    ],
    "15_Cry to mommy?": [
        {
            "text": "You betcha!",
            "replyId": "16_You betcha!"
        }
    ],
    "17_Burrito?": [
        {
            "text": "Yummy!",
            "replyId": "18_Yummy!"
        }
    ],
    "19_Delicious!": [
        {
            "text": "Great!",
            "replyId": "20_Great!"
        }
    ],
    "21_Soup?": [
        {
            "text": "Fine…",
            "replyId": "22_Fine…"
        },
        {
            "text": "Ramen noodle soup",
            "replyId": "24_Ramen noodle soup"
        },
        {
            "text": "Creamy soup",
            "replyId": "26_Creamy soup"
        }
    ],
    "22_Fine…": [
        {
            "text": "Fine...",
            "replyId": "23_Fine..."
        }
    ],
    "24_Ramen noodle soup": [
        {
            "text": "Whatever...",
            "replyId": "25_Whatever..."
        }
    ],
    "26_Creamy soup": [
        {
            "text": "I’ll cream you…",
            "replyId": "27_I’ll cream you…"
        }
    ],
    "28_Nothing then!": [
        {
            "text": "Waah!!!!",
            "replyId": "29_Waah!!!!"
        },
        {
            "text": "Home!",
            "replyId": "31_Home!"
        },
        {
            "text": "I want mommy!!",
            "replyId": "33_I want mommy!!"
        }
    ],
    "29_Waah!!!!": [
        {
            "text": "You big cry baby!",
            "replyId": "30_You big cry baby!"
        }
    ],
    "31_Home!": [
        {
            "text": "Good idea",
            "replyId": "32_Good idea"
        }
    ],
    "33_I want mommy!!": [
        {
            "text": "Home. Let’s go!",
            "replyId": "34_Home. Let’s go!"
        }
    ],
    "35_Hamburger!": [
        {
            "text": "Try again…",
            "replyId": "36_Try again…"
        },
        {
            "text": "Veggie burger.",
            "replyId": "43_Veggie burger."
        },
        {
            "text": "Sure.",
            "replyId": "55_Sure."
        }
    ],
    "36_Try again…": [
        {
            "text": "Tacos?",
            "replyId": "37_Tacos?"
        },
        {
            "text": "Burrito?",
            "replyId": "39_Burrito?"
        },
        {
            "text": "Pizza?",
            "replyId": "41_Pizza?"
        }
    ],
    "37_Tacos?": [
        {
            "text": "Fine…",
            "replyId": "38_Fine…"
        }
    ],
    "39_Burrito?": [
        {
            "text": "Love it!",
            "replyId": "40_Love it!"
        }
    ],
    "41_Pizza?": [
        {
            "text": "Are you deaf?",
            "replyId": "42_Are you deaf?"
        }
    ],
    "43_Veggie burger.": [
        {
            "text": "Gross!",
            "replyId": "44_Gross!"
        },
        {
            "text": "No way!",
            "replyId": "46_No way!"
        },
        {
            "text": "Fiiiiiiiiine!",
            "replyId": "53_Fiiiiiiiiine!"
        }
    ],
    "44_Gross!": [
        {
            "text": "I’ll be the judge of that.",
            "replyId": "45_I’ll be the judge of that."
        }
    ],
    "46_No way!": [
        {
            "text": "Veggie pizza.",
            "replyId": "47_Veggie pizza."
        },
        {
            "text": "Veggie patties.",
            "replyId": "49_Veggie patties."
        },
        {
            "text": "Veggie soup.",
            "replyId": "51_Veggie soup."
        }
    ],
    "47_Veggie pizza.": [
        {
            "text": "Grrr",
            "replyId": "48_Grrr"
        }
    ],
    "49_Veggie patties.": [
        {
            "text": "Grrr",
            "replyId": "50_Grrr"
        }
    ],
    "51_Veggie soup.": [
        {
            "text": "Grrr",
            "replyId": "52_Grrr"
        }
    ],
    "53_Fiiiiiiiiine!": [
        {
            "text": "Fine!",
            "replyId": "54_Fine!"
        }
    ],
    "55_Sure.": [
        {
            "text": "Finally! Thank YOU!!",
            "replyId": "56_Finally! Thank YOU!!"
        }
    ],
    "57_You suck!": [
        {
            "text": "You suck!",
            "replyId": "58_You suck!"
        },
        {
            "text": "Grounded!",
            "replyId": "60_Grounded!"
        },
        {
            "text": "Starve!",
            "replyId": "62_Starve!"
        }
    ],
    "58_You suck!": [
        {
            "text": "Waah!!!!",
            "replyId": "59_Waah!!!!"
        }
    ],
    "60_Grounded!": [
        {
            "text": "Waah!!!!",
            "replyId": "61_Waah!!!!"
        }
    ],
    "62_Starve!": [
        {
            "text": "Waah!!!!",
            "replyId": "63_Waah!!!!"
        }
    ],
    "64_Yum!": [
        {
            "text": "Yessss!",
            "replyId": "65_Yessss!"
        },
        {
            "text": "Peperoni?",
            "replyId": "72_Peperoni?"
        },
        {
            "text": "Extra cheesy?",
            "replyId": "79_Extra cheesy?"
        }
    ],
    "65_Yessss!": [
        {
            "text": "Homemade?",
            "replyId": "66_Homemade?"
        },
        {
            "text": "Delivery?",
            "replyId": "68_Delivery?"
        },
        {
            "text": "Italian restaurant?",
            "replyId": "70_Italian restaurant?"
        }
    ],
    "66_Homemade?": [
        {
            "text": "Yayyyyy!!",
            "replyId": "67_Yayyyyy!!"
        }
    ],
    "68_Delivery?": [
        {
            "text": "Duhhh!",
            "replyId": "69_Duhhh!"
        }
    ],
    "70_Italian restaurant?": [
        {
            "text": "A father-son date!",
            "replyId": "71_A father-son date!"
        }
    ],
    "72_Peperoni?": [
        {
            "text": "Yum!",
            "replyId": "73_Yum!"
        },
        {
            "text": "Veggie?",
            "replyId": "75_Veggie?"
        },
        {
            "text": "Duhhh!",
            "replyId": "77_Duhhh!"
        }
    ],
    "73_Yum!": [
        {
            "text": "Let’s go!",
            "replyId": "74_Let’s go!"
        }
    ],
    "75_Veggie?": [
        {
            "text": "My favorite!",
            "replyId": "76_My favorite!"
        }
    ],
    "77_Duhhh!": [
        {
            "text": "I raised you well…",
            "replyId": "78_I raised you well…"
        }
    ],
    "79_Extra cheesy?": [
        {
            "text": "You betcha!",
            "replyId": "80_You betcha!"
        },
        {
            "text": "Yes sir!",
            "replyId": "82_Yes sir!"
        },
        {
            "text": "No way!",
            "replyId": "84_No way!"
        }
    ],
    "80_You betcha!": [
        {
            "text": "Best dad in the world!",
            "replyId": "81_Best dad in the world!"
        }
    ],
    "82_Yes sir!": [
        {
            "text": "At ease, soldier!",
            "replyId": "83_At ease, soldier!"
        }
    ],
    "84_No way!": [
        {
            "text": "Cheap bastard…",
            "replyId": "85_Cheap bastard…"
        }
    ],
    "86_How about pasta?": [
        {
            "text": "No! Pizza!",
            "replyId": "87_No! Pizza!"
        },
        {
            "text": "What kind of pasta?",
            "replyId": "102_What kind of pasta?"
        },
        {
            "text": "Fine, dad!",
            "replyId": "124_Fine, dad!"
        }
    ],
    "87_No! Pizza!": [
        {
            "text": "Pasta!",
            "replyId": "88_Pasta!"
        },
        {
            "text": "Salad",
            "replyId": "95_Salad"
        }
    ],
    "88_Pasta!": [
        {
            "text": "Pizza!!",
            "replyId": "89_Pizza!!"
        },
        {
            "text": "Nooooo",
            "replyId": "91_Nooooo"
        },
        {
            "text": "Fine!",
            "replyId": "93_Fine!"
        }
    ],
    "89_Pizza!!": [
        {
            "text": "Yes master.",
            "replyId": "90_Yes master."
        }
    ],
    "91_Nooooo": [
        {
            "text": "YEEEEEES!!!",
            "replyId": "92_YEEEEEES!!!"
        }
    ],
    "93_Fine!": [
        {
            "text": "FINE!",
            "replyId": "94_FINE!"
        }
    ],
    "95_Salad": [
        {
            "text": "Pizza!!",
            "replyId": "96_Pizza!!"
        },
        {
            "text": "No way…",
            "replyId": "98_No way…"
        },
        {
            "text": "Fiiiiine!",
            "replyId": "100_Fiiiiine!"
        }
    ],
    "96_Pizza!!": [
        {
            "text": "Your wish is my command.",
            "replyId": "97_Your wish is my command."
        }
    ],
    "98_No way…": [
        {
            "text": "Yes way!",
            "replyId": "99_Yes way!"
        }
    ],
    "100_Fiiiiine!": [
        {
            "text": "We appreciate your cooperation.",
            "replyId": "101_We appreciate your cooperation."
        }
    ],
    "102_What kind of pasta?": [
        {
            "text": "Pesto",
            "replyId": "103_Pesto"
        },
        {
            "text": "Strangozzi with black truffle",
            "replyId": "110_Strangozzi with black truffle"
        },
        {
            "text": "Whatever mom makes.",
            "replyId": "117_Whatever mom makes."
        }
    ],
    "103_Pesto": [
        {
            "text": "Cool.",
            "replyId": "104_Cool."
        },
        {
            "text": "Yummy!",
            "replyId": "106_Yummy!"
        },
        {
            "text": "With cream?",
            "replyId": "108_With cream?"
        }
    ],
    "104_Cool.": [
        {
            "text": "See?! Super easy choice!",
            "replyId": "105_See?! Super easy choice!"
        }
    ],
    "106_Yummy!": [
        {
            "text": "YES!!! THANK YOU!!!",
            "replyId": "107_YES!!! THANK YOU!!!"
        }
    ],
    "108_With cream?": [
        {
            "text": "If it’ll get you to stop talking...",
            "replyId": "109_If it’ll get you to stop talking..."
        }
    ],
    "110_Strangozzi with black truffle": [
        {
            "text": "What?!",
            "replyId": "111_What?!"
        },
        {
            "text": "My favorite!!",
            "replyId": "113_My favorite!!"
        },
        {
            "text": "Fine, whatever",
            "replyId": "115_Fine, whatever"
        }
    ],
    "111_What?!": [
        {
            "text": "Trust me, you’ll love it...",
            "replyId": "112_Trust me, you’ll love it..."
        }
    ],
    "113_My favorite!!": [
        {
            "text": "Fancy little mofo...",
            "replyId": "114_Fancy little mofo..."
        }
    ],
    "115_Fine, whatever": [
        {
            "text": "Finally!",
            "replyId": "116_Finally!"
        }
    ],
    "117_Whatever mom makes.": [
        {
            "text": "Mom’s the best!",
            "replyId": "118_Mom’s the best!"
        },
        {
            "text": "Why can’t you be more like mommy?",
            "replyId": "120_Why can’t you be more like mommy?"
        },
        {
            "text": "Dad! You know mom can’t cook…",
            "replyId": "122_Dad! You know mom can’t cook…"
        }
    ],
    "118_Mom’s the best!": [
        {
            "text": "Yes she is! Let’s see where she is.",
            "replyId": "119_Yes she is! Let’s see where she is."
        }
    ],
    "120_Why can’t you be more like mommy?": [
        {
            "text": "Cause I’m the best!",
            "replyId": "121_Cause I’m the best!"
        }
    ],
    "122_Dad! You know mom can’t cook…": [
        {
            "text": "She’ll just have to learn.",
            "replyId": "123_She’ll just have to learn."
        }
    ],
    "124_Fine, dad!": [
        {
            "text": "I am. Thanks for noticing!",
            "replyId": "125_I am. Thanks for noticing!"
        }
    ],
    "126_Nope.": [
        {
            "text": "Are you sure?",
            "replyId": "127_Are you sure?"
        },
        {
            "text": "Wanna swing instead?",
            "replyId": "174_Wanna swing instead?"
        },
        {
            "text": "You’ll starve to death",
            "replyId": "181_You’ll starve to death"
        }
    ],
    "127_Are you sure?": [
        {
            "text": "I don’t know.",
            "replyId": "128_I don’t know."
        },
        {
            "text": "Yep.",
            "replyId": "170_Yep."
        },
        {
            "text": "Sure of what?",
            "replyId": "172_Sure of what?"
        }
    ],
    "128_I don’t know.": [
        {
            "text": "How ‘bout now?",
            "replyId": "129_How ‘bout now?"
        },
        {
            "text": "Do. You. Wanna. Eat?",
            "replyId": "136_Do. You. Wanna. Eat?"
        },
        {
            "text": "You’ll starve to death",
            "replyId": "163_You’ll starve to death"
        }
    ],
    "129_How ‘bout now?": [
        {
            "text": "Nope.",
            "replyId": "130_Nope."
        },
        {
            "text": "Could be…",
            "replyId": "132_Could be…"
        },
        {
            "text": "OK. I’m hungry.",
            "replyId": "134_OK. I’m hungry."
        }
    ],
    "130_Nope.": [
        {
            "text": "Fine. Starve.",
            "replyId": "131_Fine. Starve."
        }
    ],
    "132_Could be…": [
        {
            "text": "Love how decisive you are!",
            "replyId": "133_Love how decisive you are!"
        }
    ],
    "134_OK. I’m hungry.": [
        {
            "text": "Thank you Jesus!",
            "replyId": "135_Thank you Jesus!"
        }
    ],
    "136_Do. You. Wanna. Eat?": [
        {
            "text": "No.",
            "replyId": "137_No."
        },
        {
            "text": "Maybe?",
            "replyId": "139_Maybe?"
        },
        {
            "text": "I. DO. NOT. KNOW!",
            "replyId": "161_I. DO. NOT. KNOW!"
        }
    ],
    "137_No.": [
        {
            "text": "Fine!",
            "replyId": "138_Fine!"
        }
    ],
    "139_Maybe?": [
        {
            "text": "Wonderful.",
            "replyId": "140_Wonderful."
        },
        {
            "text": "Well, which is it?",
            "replyId": "147_Well, which is it?"
        },
        {
            "text": "I say you do & I decide!",
            "replyId": "154_I say you do & I decide!"
        }
    ],
    "140_Wonderful.": [
        {
            "text": "What is?",
            "replyId": "141_What is?"
        },
        {
            "text": "Is it?",
            "replyId": "143_Is it?"
        },
        {
            "text": "I know!",
            "replyId": "145_I know!"
        }
    ],
    "141_What is?": [
        {
            "text": "You are!",
            "replyId": "142_You are!"
        }
    ],
    "143_Is it?": [
        {
            "text": "Uggggh!",
            "replyId": "144_Uggggh!"
        }
    ],
    "145_I know!": [
        {
            "text": "You Know Nothing, Jon Snow.",
            "replyId": "146_You Know Nothing, Jon Snow."
        }
    ],
    "147_Well, which is it?": [
        {
            "text": "I’m hungry.",
            "replyId": "148_I’m hungry."
        },
        {
            "text": "Definitely NOT hungry.",
            "replyId": "150_Definitely NOT hungry."
        },
        {
            "text": "I wanna go home.",
            "replyId": "152_I wanna go home."
        }
    ],
    "148_I’m hungry.": [
        {
            "text": "Seriously?!?!",
            "replyId": "149_Seriously?!?!"
        }
    ],
    "150_Definitely NOT hungry.": [
        {
            "text": "Ok. Let’s get you home.",
            "replyId": "151_Ok. Let’s get you home."
        }
    ],
    "152_I wanna go home.": [
        {
            "text": "Sure thing buddy!",
            "replyId": "153_Sure thing buddy!"
        }
    ],
    "154_I say you do & I decide!": [
        {
            "text": "When did you become so assertive?",
            "replyId": "155_When did you become so assertive?"
        },
        {
            "text": "Of course you do…",
            "replyId": "157_Of course you do…"
        },
        {
            "text": "Stop it. You’re scaring me!",
            "replyId": "159_Stop it. You’re scaring me!"
        }
    ],
    "155_When did you become so assertive?": [
        {
            "text": "Just now.",
            "replyId": "156_Just now."
        }
    ],
    "157_Of course you do…": [
        {
            "text": "I do, don’t I?",
            "replyId": "158_I do, don’t I?"
        }
    ],
    "159_Stop it. You’re scaring me!": [
        {
            "text": "Good!",
            "replyId": "160_Good!"
        }
    ],
    "161_I. DO. NOT. KNOW!": [
        {
            "text": "Uggggh!",
            "replyId": "162_Uggggh!"
        }
    ],
    "163_You’ll starve to death": [
        {
            "text": "No I won’t!",
            "replyId": "164_No I won’t!"
        },
        {
            "text": "So dramatic…",
            "replyId": "166_So dramatic…"
        },
        {
            "text": "Such a douchebag",
            "replyId": "168_Such a douchebag"
        }
    ],
    "164_No I won’t!": [
        {
            "text": "I know...just being dramatic.",
            "replyId": "165_I know...just being dramatic."
        }
    ],
    "166_So dramatic…": [
        {
            "text": "Don’t have children...",
            "replyId": "167_Don’t have children..."
        }
    ],
    "168_Such a douchebag": [
        {
            "text": "Language!",
            "replyId": "169_Language!"
        }
    ],
    "170_Yep.": [
        {
            "text": "#1 Dad in the world!",
            "replyId": "171_#1 Dad in the world!"
        }
    ],
    "172_Sure of what?": [
        {
            "text": "Just anything at this point...",
            "replyId": "173_Just anything at this point..."
        }
    ],
    "174_Wanna swing instead?": [
        {
            "text": "Yes.",
            "replyId": "175_Yes."
        },
        {
            "text": "No.",
            "replyId": "177_No."
        },
        {
            "text": "I wanna play basketball.",
            "replyId": "179_I wanna play basketball."
        }
    ],
    "175_Yes.": [
        {
            "text": "Yayyyyy!",
            "replyId": "176_Yayyyyy!"
        }
    ],
    "177_No.": [
        {
            "text": "Fine. Stay up there, forever!",
            "replyId": "178_Fine. Stay up there, forever!"
        }
    ],
    "179_I wanna play basketball.": [
        {
            "text": "Alrighty then! Let’s go!",
            "replyId": "180_Alrighty then! Let’s go!"
        }
    ],
    "181_You’ll starve to death": [
        {
            "text": "No I won’t!",
            "replyId": "182_No I won’t!"
        },
        {
            "text": "So dramatic…",
            "replyId": "184_So dramatic…"
        },
        {
            "text": "Such a douchebag",
            "replyId": "186_Such a douchebag"
        }
    ],
    "182_No I won’t!": [
        {
            "text": "I know...just being dramatic.",
            "replyId": "183_I know...just being dramatic."
        }
    ],
    "184_So dramatic…": [
        {
            "text": "Don’t have children…",
            "replyId": "185_Don’t have children…"
        }
    ],
    "186_Such a douchebag": [
        {
            "text": "Language!",
            "replyId": "187_Language!"
        }
    ],
    "188_Yes! Fooooood!": [
        {
            "text": "That was easy…",
            "replyId": "189_That was easy…"
        },
        {
            "text": "What kind of food?",
            "replyId": "196_What kind of food?"
        },
        {
            "text": "Pasta?",
            "replyId": "203_Pasta?"
        }
    ],
    "189_That was easy…": [
        {
            "text": "I know, right?",
            "replyId": "190_I know, right?"
        },
        {
            "text": "I can make it complicated...",
            "replyId": "192_I can make it complicated..."
        },
        {
            "text": "I love you, dad!",
            "replyId": "194_I love you, dad!"
        }
    ],
    "190_I know, right?": [
        {
            "text": "I love you, kid!",
            "replyId": "191_I love you, kid!"
        }
    ],
    "192_I can make it complicated...": [
        {
            "text": "Please don’t!",
            "replyId": "193_Please don’t!"
        }
    ],
    "194_I love you, dad!": [
        {
            "text": "I love you too, kid!",
            "replyId": "195_I love you too, kid!"
        }
    ],
    "196_What kind of food?": [
        {
            "text": "The tasty kind",
            "replyId": "197_The tasty kind"
        },
        {
            "text": "Don’t know. You decide.",
            "replyId": "199_Don’t know. You decide."
        },
        {
            "text": "ALL THE FOOD!",
            "replyId": "201_ALL THE FOOD!"
        }
    ],
    "197_The tasty kind": [
        {
            "text": "Tasty food coming up!",
            "replyId": "198_Tasty food coming up!"
        }
    ],
    "199_Don’t know. You decide.": [
        {
            "text": "I have died & gone to heaven.",
            "replyId": "200_I have died & gone to heaven."
        }
    ],
    "201_ALL THE FOOD!": [
        {
            "text": "God, I love that kid...",
            "replyId": "202_God, I love that kid..."
        }
    ],
    "203_Pasta?": [
        {
            "text": "No! Pizza!",
            "replyId": "204_No! Pizza!"
        },
        {
            "text": "Salad",
            "replyId": "214_Salad"
        },
        {
            "text": "What kind of pasta?",
            "replyId": "224_What kind of pasta?"
        }
    ],
    "204_No! Pizza!": [
        {
            "text": "Pasta!",
            "replyId": "205_Pasta!"
        },
        {
            "text": "Nooooo",
            "replyId": "208_Nooooo"
        },
        {
            "text": "Fine!",
            "replyId": "211_Fine!"
        }
    ],
    "205_Pasta!": [
        {
            "text": "Pizza!!",
            "replyId": "206_Pizza!!"
        }
    ],
    "206_Pizza!!": [
        {
            "text": "Yes master.",
            "replyId": "207_Yes master."
        }
    ],
    "208_Nooooo": [
        {
            "text": "YEEEEEES!!!",
            "replyId": "209_YEEEEEES!!!"
        }
    ],
    "209_YEEEEEES!!!": [
        {
            "text": "No Friggin way!",
            "replyId": "210_No Friggin way!"
        }
    ],
    "211_Fine!": [
        {
            "text": "FINE!",
            "replyId": "212_FINE!"
        }
    ],
    "212_FINE!": [
        {
            "text": "FINE!",
            "replyId": "213_FINE!"
        }
    ],
    "214_Salad": [
        {
            "text": "Salad? Is everything ok?",
            "replyId": "215_Salad? Is everything ok?"
        },
        {
            "text": "No way…",
            "replyId": "218_No way…"
        },
        {
            "text": "Wonderful!",
            "replyId": "221_Wonderful!"
        }
    ],
    "215_Salad? Is everything ok?": [
        {
            "text": "I don’t know dad…",
            "replyId": "216_I don’t know dad…"
        }
    ],
    "216_I don’t know dad…": [
        {
            "text": "C’mon. Let’s go see a doctor.",
            "replyId": "217_C’mon. Let’s go see a doctor."
        }
    ],
    "218_No way…": [
        {
            "text": "Yes way!",
            "replyId": "219_Yes way!"
        }
    ],
    "219_Yes way!": [
        {
            "text": "1 Salad coming up (you weirdo)!",
            "replyId": "220_1 Salad coming up (you weirdo)!"
        }
    ],
    "221_Wonderful!": [
        {
            "text": "Make it extra healthy!",
            "replyId": "222_Make it extra healthy!"
        }
    ],
    "222_Make it extra healthy!": [
        {
            "text": "Yes sir!",
            "replyId": "223_Yes sir!"
        }
    ],
    "224_What kind of pasta?": [
        {
            "text": "Pesto",
            "replyId": "225_Pesto"
        },
        {
            "text": "Strangozzi with black truffle",
            "replyId": "232_Strangozzi with black truffle"
        },
        {
            "text": "Whatever mom makes.",
            "replyId": "239_Whatever mom makes."
        }
    ],
    "225_Pesto": [
        {
            "text": "Cool.",
            "replyId": "226_Cool."
        },
        {
            "text": "Yummy!",
            "replyId": "228_Yummy!"
        },
        {
            "text": "With cream?",
            "replyId": "230_With cream?"
        }
    ],
    "226_Cool.": [
        {
            "text": "See?! Super easy choice!",
            "replyId": "227_See?! Super easy choice!"
        }
    ],
    "228_Yummy!": [
        {
            "text": "YES!!! THANK YOU!!!",
            "replyId": "229_YES!!! THANK YOU!!!"
        }
    ],
    "230_With cream?": [
        {
            "text": "If it’ll get you to stop talking…",
            "replyId": "231_If it’ll get you to stop talking…"
        }
    ],
    "232_Strangozzi with black truffle": [
        {
            "text": "What?!",
            "replyId": "233_What?!"
        },
        {
            "text": "My favorite!!",
            "replyId": "235_My favorite!!"
        },
        {
            "text": "Fine, whatever",
            "replyId": "237_Fine, whatever"
        }
    ],
    "233_What?!": [
        {
            "text": "Trust me, you’ll love it…",
            "replyId": "234_Trust me, you’ll love it…"
        }
    ],
    "235_My favorite!!": [
        {
            "text": "Fancy little mofo…",
            "replyId": "236_Fancy little mofo…"
        }
    ],
    "237_Fine, whatever": [
        {
            "text": "Finally!",
            "replyId": "238_Finally!"
        }
    ],
    "239_Whatever mom makes.": [
        {
            "text": "Mom’s the best!",
            "replyId": "240_Mom’s the best!"
        },
        {
            "text": "Why can’t you be more like mommy?",
            "replyId": "242_Why can’t you be more like mommy?"
        },
        {
            "text": "Dad! You know mom can’t cook…",
            "replyId": "244_Dad! You know mom can’t cook…"
        }
    ],
    "240_Mom’s the best!": [
        {
            "text": "Yes she is! Let’s see where she is.",
            "replyId": "241_Yes she is! Let’s see where she is."
        }
    ],
    "242_Why can’t you be more like mommy?": [
        {
            "text": "Cause I’m the best!",
            "replyId": "243_Cause I’m the best!"
        }
    ],
    "244_Dad! You know mom can’t cook…": [
        {
            "text": "She’ll just have to learn.",
            "replyId": "245_She’ll just have to learn."
        }
    ],
    "246_2. Thirsty?": [
        {
            "text": "Soda.",
            "replyId": "247_Soda."
        },
        {
            "text": "Milkshake.",
            "replyId": "279_Milkshake."
        },
        {
            "text": "Your blood.",
            "replyId": "301_Your blood."
        }
    ],
    "247_Soda.": [
        {
            "text": "Soda water?",
            "replyId": "248_Soda water?"
        },
        {
            "text": "No, you’ll have water.",
            "replyId": "265_No, you’ll have water."
        },
        {
            "text": "What, a Coke?",
            "replyId": "277_What, a Coke?"
        }
    ],
    "248_Soda water?": [
        {
            "text": "Who am I? Grandma?",
            "replyId": "249_Who am I? Grandma?"
        },
        {
            "text": "Gross!",
            "replyId": "256_Gross!"
        },
        {
            "text": "NO! A coke.",
            "replyId": "263_NO! A coke."
        }
    ],
    "249_Who am I? Grandma?": [
        {
            "text": "Funny son.",
            "replyId": "250_Funny son."
        },
        {
            "text": "So what? A Coke?",
            "replyId": "252_So what? A Coke?"
        },
        {
            "text": "So a Sprite?",
            "replyId": "254_So a Sprite?"
        }
    ],
    "250_Funny son.": [
        {
            "text": "I’ll have a Coke now.",
            "replyId": "251_I’ll have a Coke now."
        }
    ],
    "252_So what? A Coke?": [
        {
            "text": "Duh, what else?",
            "replyId": "253_Duh, what else?"
        }
    ],
    "254_So a Sprite?": [
        {
            "text": "Yes, please.",
            "replyId": "255_Yes, please."
        }
    ],
    "256_Gross!": [
        {
            "text": "You’re gross.",
            "replyId": "257_You’re gross."
        },
        {
            "text": "You want a Coke then?",
            "replyId": "259_You want a Coke then?"
        },
        {
            "text": "Sprite?",
            "replyId": "261_Sprite?"
        }
    ],
    "257_You’re gross.": [
        {
            "text": "Yo mama’s gross!",
            "replyId": "258_Yo mama’s gross!"
        }
    ],
    "259_You want a Coke then?": [
        {
            "text": "Obviously...",
            "replyId": "260_Obviously..."
        }
    ],
    "261_Sprite?": [
        {
            "text": "Yes! Duh.",
            "replyId": "262_Yes! Duh."
        }
    ],
    "263_NO! A coke.": [
        {
            "text": "Here you go my precious.",
            "replyId": "264_Here you go my precious."
        }
    ],
    "265_No, you’ll have water.": [
        {
            "text": "Fine, give me!",
            "replyId": "266_Fine, give me!"
        },
        {
            "text": "Nope, I’ll be having a Coke.",
            "replyId": "268_Nope, I’ll be having a Coke."
        },
        {
            "text": "Water’s boring.",
            "replyId": "270_Water’s boring."
        }
    ],
    "266_Fine, give me!": [
        {
            "text": "Wise decision.",
            "replyId": "267_Wise decision."
        }
    ],
    "268_Nope, I’ll be having a Coke.": [
        {
            "text": "You’ll be having my fist.",
            "replyId": "269_You’ll be having my fist."
        }
    ],
    "270_Water’s boring.": [
        {
            "text": "Then you can have juice.",
            "replyId": "271_Then you can have juice."
        },
        {
            "text": "It’s important.",
            "replyId": "273_It’s important."
        },
        {
            "text": "Then stay thirsty.",
            "replyId": "275_Then stay thirsty."
        }
    ],
    "271_Then you can have juice.": [
        {
            "text": "Good compromise dad.",
            "replyId": "272_Good compromise dad."
        }
    ],
    "273_It’s important.": [
        {
            "text": "I’m important, now give me Coke.",
            "replyId": "274_I’m important, now give me Coke."
        }
    ],
    "275_Then stay thirsty.": [
        {
            "text": "You suck. Give me the water.",
            "replyId": "276_You suck. Give me the water."
        }
    ],
    "277_What, a Coke?": [
        {
            "text": "Precisely.",
            "replyId": "278_Precisely."
        }
    ],
    "279_Milkshake.": [
        {
            "text": "Only if it’s chocolate!",
            "replyId": "280_Only if it’s chocolate!"
        },
        {
            "text": "No, you’re fat enough.",
            "replyId": "282_No, you’re fat enough."
        },
        {
            "text": "You can have a smoothie.",
            "replyId": "289_You can have a smoothie."
        }
    ],
    "280_Only if it’s chocolate!": [
        {
            "text": "Dad knows best!",
            "replyId": "281_Dad knows best!"
        }
    ],
    "282_No, you’re fat enough.": [
        {
            "text": "I’m a teddy bear.",
            "replyId": "283_I’m a teddy bear."
        },
        {
            "text": "You’re the fattest person I know!",
            "replyId": "285_You’re the fattest person I know!"
        },
        {
            "text": "You’re so mean!",
            "replyId": "287_You’re so mean!"
        }
    ],
    "283_I’m a teddy bear.": [
        {
            "text": "But not the cute kind.",
            "replyId": "284_But not the cute kind."
        }
    ],
    "285_You’re the fattest person I know!": [
        {
            "text": "Your mom doesn’t mind.",
            "replyId": "286_Your mom doesn’t mind."
        }
    ],
    "287_You’re so mean!": [
        {
            "text": "Get used to it.",
            "replyId": "288_Get used to it."
        }
    ],
    "289_You can have a smoothie.": [
        {
            "text": "With chocolate?!",
            "replyId": "290_With chocolate?!"
        },
        {
            "text": "Good idea dad!",
            "replyId": "297_Good idea dad!"
        },
        {
            "text": "With strawberries, bananas, mangos….",
            "replyId": "299_With strawberries, bananas, mangos…."
        }
    ],
    "290_With chocolate?!": [
        {
            "text": "A little.",
            "replyId": "291_A little."
        },
        {
            "text": "No, fatty.",
            "replyId": "293_No, fatty."
        },
        {
            "text": "Just this time.",
            "replyId": "295_Just this time."
        }
    ],
    "291_A little.": [
        {
            "text": "Cool.",
            "replyId": "292_Cool."
        }
    ],
    "293_No, fatty.": [
        {
            "text": "Fine!",
            "replyId": "294_Fine!"
        }
    ],
    "295_Just this time.": [
        {
            "text": "You’re the best.",
            "replyId": "296_You’re the best."
        }
    ],
    "297_Good idea dad!": [
        {
            "text": "I’m brilliant, don’t you know?",
            "replyId": "298_I’m brilliant, don’t you know?"
        }
    ],
    "299_With strawberries, bananas, mangos….": [
        {
            "text": "Yea, yea. Shut up.",
            "replyId": "300_Yea, yea. Shut up."
        }
    ],
    "301_Your blood.": [
        {
            "text": "You think you’re so funny.",
            "replyId": "302_You think you’re so funny."
        },
        {
            "text": "You’re grounded!",
            "replyId": "310_You’re grounded!"
        },
        {
            "text": "Drink up, psycho.",
            "replyId": "312_Drink up, psycho."
        }
    ],
    "302_You think you’re so funny.": [
        {
            "text": "I’m serious.",
            "replyId": "303_I’m serious."
        }
    ],
    "303_I’m serious.": [
        {
            "text": "Sure, son.",
            "replyId": "304_Sure, son."
        },
        {
            "text": "Oh stop. Now drink water.",
            "replyId": "306_Oh stop. Now drink water."
        },
        {
            "text": "Hellllppp!",
            "replyId": "308_Hellllppp!"
        }
    ],
    "304_Sure, son.": [
        {
            "text": "Nom Nom…",
            "replyId": "305_Nom Nom…"
        }
    ],
    "306_Oh stop. Now drink water.": [
        {
            "text": "You’re never any fun.",
            "replyId": "307_You’re never any fun."
        }
    ],
    "308_Hellllppp!": [
        {
            "text": "Get a grip, I’m joking.",
            "replyId": "309_Get a grip, I’m joking."
        }
    ],
    "310_You’re grounded!": [
        {
            "text": " Can’t you take a joke?",
            "replyId": "311_ Can’t you take a joke?"
        }
    ],
    "312_Drink up, psycho.": [
        {
            "text": "Ummm, ok.",
            "replyId": "313_Ummm, ok."
        }
    ],
    "314_3. Tired?": [
        {
            "text": "Nooo!",
            "replyId": "315_Nooo!"
        },
        {
            "text": "Tired?! No way!",
            "replyId": "347_Tired?! No way!"
        },
        {
            "text": "What’d you ask?",
            "replyId": "379_What’d you ask?"
        }
    ],
    "315_Nooo!": [
        {
            "text": "Wanna play hide and seek?",
            "replyId": "316_Wanna play hide and seek?"
        },
        {
            "text": "Want to have a race?",
            "replyId": "328_Want to have a race?"
        },
        {
            "text": "Want to play soccer?",
            "replyId": "335_Want to play soccer?"
        }
    ],
    "316_Wanna play hide and seek?": [
        {
            "text": "What am I, five?",
            "replyId": "317_What am I, five?"
        },
        {
            "text": "Ready or not, here I come!",
            "replyId": "324_Ready or not, here I come!"
        },
        {
            "text": "Sure, go hide.",
            "replyId": "326_Sure, go hide."
        }
    ],
    "317_What am I, five?": [
        {
            "text": "You used to love this game.",
            "replyId": "318_You used to love this game."
        },
        {
            "text": "You could have fooled me.",
            "replyId": "320_You could have fooled me."
        },
        {
            "text": "So go find something else to do.",
            "replyId": "322_So go find something else to do."
        }
    ],
    "318_You used to love this game.": [
        {
            "text": "I grew up. You should do the same.",
            "replyId": "319_I grew up. You should do the same."
        }
    ],
    "320_You could have fooled me.": [
        {
            "text": "Oh shut up.",
            "replyId": "321_Oh shut up."
        }
    ],
    "322_So go find something else to do.": [
        {
            "text": "I will!",
            "replyId": "323_I will!"
        }
    ],
    "324_Ready or not, here I come!": [
        {
            "text": "No, I’m not ready!",
            "replyId": "325_No, I’m not ready!"
        }
    ],
    "326_Sure, go hide.": [
        {
            "text": "You’re not going to even look.",
            "replyId": "327_You’re not going to even look."
        }
    ],
    "328_Want to have a race?": [
        {
            "text": "Ready, set, GO!",
            "replyId": "329_Ready, set, GO!"
        },
        {
            "text": "You’re too old.",
            "replyId": "331_You’re too old."
        },
        {
            "text": "I’m gonna cream you!",
            "replyId": "333_I’m gonna cream you!"
        }
    ],
    "329_Ready, set, GO!": [
        {
            "text": "Owwww, my ankle!",
            "replyId": "330_Owwww, my ankle!"
        }
    ],
    "331_You’re too old.": [
        {
            "text": "You better watch it!",
            "replyId": "332_You better watch it!"
        }
    ],
    "333_I’m gonna cream you!": [
        {
            "text": "Ha, like to see you try.",
            "replyId": "334_Ha, like to see you try."
        }
    ],
    "335_Want to play soccer?": [
        {
            "text": "Not really.",
            "replyId": "336_Not really."
        },
        {
            "text": "Yes. I’m  the best!",
            "replyId": "338_Yes. I’m  the best!"
        },
        {
            "text": "Always. I’m on the team.",
            "replyId": "340_Always. I’m on the team."
        }
    ],
    "336_Not really.": [
        {
            "text": "Good, I didn’t want to either.",
            "replyId": "337_Good, I didn’t want to either."
        }
    ],
    "338_Yes. I’m  the best!": [
        {
            "text": "You think you’re the best.",
            "replyId": "339_You think you’re the best."
        }
    ],
    "340_Always. I’m on the team.": [
        {
            "text": "Since when?",
            "replyId": "341_Since when?"
        },
        {
            "text": "Oh yea.",
            "replyId": "343_Oh yea."
        },
        {
            "text": "No way.",
            "replyId": "345_No way."
        }
    ],
    "341_Since when?": [
        {
            "text": "Since always!",
            "replyId": "342_Since always!"
        }
    ],
    "343_Oh yea.": [
        {
            "text": "You’ve been to my games!",
            "replyId": "344_You’ve been to my games!"
        }
    ],
    "345_No way.": [
        {
            "text": "Yes dad, gosh you suck.",
            "replyId": "346_Yes dad, gosh you suck."
        }
    ],
    "347_Tired?! No way!": [
        {
            "text": "Well, I am.",
            "replyId": "348_Well, I am."
        },
        {
            "text": "Want to play something?",
            "replyId": "350_Want to play something?"
        },
        {
            "text": "Want to sit and enjoy the sunset?",
            "replyId": "372_Want to sit and enjoy the sunset?"
        }
    ],
    "348_Well, I am.": [
        {
            "text": "Well duh, you’re like 100.",
            "replyId": "349_Well duh, you’re like 100."
        }
    ],
    "350_Want to play something?": [
        {
            "text": "With you?",
            "replyId": "351_With you?"
        },
        {
            "text": "Sure.",
            "replyId": "363_Sure."
        },
        {
            "text": "Basketball?",
            "replyId": "365_Basketball?"
        }
    ],
    "351_With you?": [
        {
            "text": "Of course with me.",
            "replyId": "352_Of course with me."
        },
        {
            "text": "No, with that dog.",
            "replyId": "354_No, with that dog."
        },
        {
            "text": "Yes, is there a problem?",
            "replyId": "356_Yes, is there a problem?"
        }
    ],
    "352_Of course with me.": [
        {
            "text": "You suck at everything though.",
            "replyId": "353_You suck at everything though."
        }
    ],
    "354_No, with that dog.": [
        {
            "text": "That’s what I was thinking.",
            "replyId": "355_That’s what I was thinking."
        }
    ],
    "356_Yes, is there a problem?": [
        {
            "text": "No, no problem at all.",
            "replyId": "357_No, no problem at all."
        },
        {
            "text": "Yea, you suck at all sports.",
            "replyId": "359_Yea, you suck at all sports."
        },
        {
            "text": "You’re just not fun.",
            "replyId": "361_You’re just not fun."
        }
    ],
    "357_No, no problem at all.": [
        {
            "text": "Great, so let’s play something.",
            "replyId": "358_Great, so let’s play something."
        }
    ],
    "359_Yea, you suck at all sports.": [
        {
            "text": "I blame grandpa.",
            "replyId": "360_I blame grandpa."
        }
    ],
    "361_You’re just not fun.": [
        {
            "text": "I am too!!",
            "replyId": "362_I am too!!"
        }
    ],
    "363_Sure.": [
        {
            "text": "Yaay, I love playing my boy.",
            "replyId": "364_Yaay, I love playing my boy."
        }
    ],
    "365_Basketball?": [
        {
            "text": "My favorite.",
            "replyId": "366_My favorite."
        },
        {
            "text": "You're going down!",
            "replyId": "368_You're going down!"
        },
        {
            "text": "If that’s what my boy wants.",
            "replyId": "370_If that’s what my boy wants."
        }
    ],
    "366_My favorite.": [
        {
            "text": "Mine too!",
            "replyId": "367_Mine too!"
        }
    ],
    "368_You're going down!": [
        {
            "text": "Ha, like to see you try!",
            "replyId": "369_Ha, like to see you try!"
        }
    ],
    "370_If that’s what my boy wants.": [
        {
            "text": "You’re so weird.",
            "replyId": "371_You’re so weird."
        }
    ],
    "372_Want to sit and enjoy the sunset?": [
        {
            "text": "What a lovely idea.",
            "replyId": "373_What a lovely idea."
        },
        {
            "text": "Who am I? Mom?",
            "replyId": "375_Who am I? Mom?"
        },
        {
            "text": "No weirdo.",
            "replyId": "377_No weirdo."
        }
    ],
    "373_What a lovely idea.": [
        {
            "text": "I knew you’d love it.",
            "replyId": "374_I knew you’d love it."
        }
    ],
    "375_Who am I? Mom?": [
        {
            "text": "You wish you were as lovely.",
            "replyId": "376_You wish you were as lovely."
        }
    ],
    "377_No weirdo.": [
        {
            "text": "I’m ok with that.",
            "replyId": "378_I’m ok with that."
        }
    ],
    "379_What’d you ask?": [
        {
            "text": "ARE...YOU...TIRED?",
            "replyId": "380_ARE...YOU...TIRED?"
        },
        {
            "text": "You’re tired, let’s go.",
            "replyId": "382_You’re tired, let’s go."
        },
        {
            "text": "Are you deaf or just tired?",
            "replyId": "384_Are you deaf or just tired?"
        }
    ],
    "380_ARE...YOU...TIRED?": [
        {
            "text": "Oh yea, soooooo tiiiiirrreeed.",
            "replyId": "381_Oh yea, soooooo tiiiiirrreeed."
        }
    ],
    "382_You’re tired, let’s go.": [
        {
            "text": "Home sweet home.",
            "replyId": "383_Home sweet home."
        }
    ],
    "384_Are you deaf or just tired?": [
        {
            "text": "I’m tired. Geeezzzzzzz.",
            "replyId": "385_I’m tired. Geeezzzzzzz."
        }
    ]
}