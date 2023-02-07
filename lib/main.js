"use strict";

import {getAllWords, hasWords, updateWords} from './storage.js';
import {parseNewWords,getNextWord} from './word.js';

// improve parsing

// sssss cccccc
// уууууу uuuuu
//ффф ааа - ошибка в консоли
//регистро не зависимное сравнение F - f
// дефисы, и др знаки

// FEATURES
//trim eng and ru: должен удалять знаки препинания, по крайней мере запятую, пробелы
//рандом
//write tests

//взять подсказку

//лучше перенести в куки, тогда можно переключаться между устройствами
//статистика после каждого цикла ИЛИ для сессии
//      слова, где допустил ошибки и какие
//      общее кол-во пройденных слов и сколько сделал ошибок
//запоминание слов - yandex translator API

//верстка под разные утсройства

//refactoring

//  ts
//  addEventListener
//  заменить кавычки

function getElement(id)
{
    return document.getElementById(id);
}

function getNewWords()
{
    const newWordsElement = getElement('new-words');
    const newWords = newWordsElement.value;
    if (newWords.trim() === '') {
        return [];
    }

    return parseNewWords(newWords);
}

//todo rename
function learnWords(prevWord)
{
    showWord(getNextWord(prevWord));
}

function showWord(word)
{
    getElement('new-words-wrapper').classList.add("hidden");

    getElement('word').value = word.ru;
    getElement('correct-answer').value = word.en;

    const userAnswerInput = getElement('user-answer');
    userAnswerInput.value = '';
    getElement('learn-word-wrapper').classList.remove("hidden");
    userAnswerInput.focus();
}

function showNewWordsSection()
{
    getElement('new-words').value = '';
    getElement('new-words-wrapper').classList.remove("hidden");
    getElement('learn-word-wrapper').classList.add("hidden");
}

function makeMultilinePlaceholder()
{
    const textarea = getElement('new-words');
    textarea.placeholder = textarea.placeholder.replace(/\\n/g, '\n');
}

getElement('reset-storage').onclick = function() {
    localStorage.removeItem('words');
    showNewWordsSection();
}
getElement('check').onclick = function() {
    const userAnswerElement = getElement('user-answer');
    const userAnswer = userAnswerElement.value;
    const correctAnswer = getElement('correct-answer').value;
    if (userAnswer !== correctAnswer) {
        userAnswerElement.classList.add('red');
        setTimeout(() => getElement('user-answer').classList.remove('red'), 1000);
        return;
    }

    learnWords(correctAnswer);
    return;
}
getElement('learn').onclick = function() {
    const newWords = getNewWords();
    if (newWords.length === 0) {
        alert('Invalid input');
        return;
    }
    updateWords(newWords);
    learnWords();
};

// Get the input field
getElement("user-answer").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        getElement("check").click();
    }
});

getElement('skip').addEventListener('click', function(event) {
    const currentWord = getElement('correct-answer').value;
    const nextWord = getNextWord(currentWord);
    const allWords = getAllWords();

    const currentWordIndex = allWords.findIndex((word) => word.en === currentWord);
    if (currentWordIndex === -1) {
        throw new Error("word doesn't exist");
    }

    allWords.splice(currentWordIndex, 1);
    updateWords(allWords);

    allWords.length === 0
        ? showNewWordsSection()
        : showWord(nextWord);
});

makeMultilinePlaceholder();

if (hasWords()) {
    learnWords();
}