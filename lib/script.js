"use strict";

//todo
//refactoring
//  заменить кавычки
//  encapsulate functions
//replace alert with text
//todo UI
//при нажатии на энтер должна отправлятся форма
//лучше перенести в куки, тогда можно переключаться между устройствами
//write tests


// sssss cccccc
// уууууу uuuuu

//todo запоминание слов

const cyrillicPattern = /^[\u0400-\u04FF]+$/;

function unexpectedError(message)
{
    alert(message);
    throw new Error(message);
}

function getNewWords()
{
    const newWordsElement = document.getElementById('new-words');
    const newWords = newWordsElement.value;
    if (newWords.trim() === '') {
        return [];
    }

    return parseNewWords(newWords);
}

function parseNewWords(input)
{
    const rows = input.split("\n");
    let result = [];
    rows.forEach(function (rawRow) {
        //todo смена языка должна быть один раз
        const row = rawRow.trim();
        if (row === '') {
            return;
        }
        let lang = null;
        let anotherLangCharIndex = null;
        [...row].forEach(function(value, index) {
            if (anotherLangCharIndex) {
                return;
            }
            if (value === ' ') {
                return;
            }
            const charLang = cyrillicPattern.test(value) ? 'ru' : 'en';

            if (lang === null) {
                lang = charLang;
                return;
            }

            if (lang !== charLang) {
                if (anotherLangCharIndex !== null) {
                    unexpectedError('Invalid input')
                }
                anotherLangCharIndex = index;
                return;
            }
        })

        if (anotherLangCharIndex === null) {
            unexpectedError('Invalid input');
        }

        const wordA = row.substring(0, anotherLangCharIndex).trim();
        const wordB = row.substring(anotherLangCharIndex).trim();

        result.push( {
            'en': !cyrillicPattern.test(wordA[0]) ? wordA : wordB,
            'ru': cyrillicPattern.test(wordA[0]) ? wordA : wordB
        });
    });

    if (result.length === 0) {
        unexpectedError('Invalid input')
    }

    return result;
}

function learnWords(words)
{
    document.getElementById('new-words-wrapper').classList.add("hidden");

    document.getElementById('word').value = words[0].ru;
    document.getElementById('correct-answer').value = words[0].en;
    document.getElementById('user-answer').value = '';
    document.getElementById('learn-word-wrapper').classList.remove("hidden");
}

function showNewWordsSection()
{
    document.getElementById('new-words').value = '';
    document.getElementById('new-words-wrapper').classList.remove("hidden");
    document.getElementById('learn-word-wrapper').classList.add("hidden");
}

window.onload = function() {
    document.getElementById('reset-storage').onclick = function() {
        localStorage.removeItem('words');
        showNewWordsSection();
        console.log('removed!');
    }
    document.getElementById('check').onclick = function() {
        const userAnswer = document.getElementById('user-answer').value;
        const correctAnswer = document.getElementById('correct-answer').value;
        if (userAnswer !== correctAnswer) {
            alert('No, try again');
            return;
        }

        const storedWordsAsString = localStorage.getItem('words');
        if (storedWordsAsString) {
            const storedWords = JSON.parse(storedWordsAsString);
            const storedWordsExceptAnswer = storedWords.filter(word => word.en !== correctAnswer);
            learnWords(storedWordsExceptAnswer);
            return;
        }
    }
    document.getElementById('learn').onclick = function() {
        const newWords = getNewWords();
        if (newWords.length === 0) {
            alert('Invalid input');
            return;
        }
        localStorage.setItem('words', JSON.stringify(newWords));
        learnWords(newWords);
    };

    const storedWords = localStorage.getItem('words');
    if (storedWords) {
        learnWords(JSON.parse(storedWords));
        return;
    }
}
