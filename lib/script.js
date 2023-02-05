"use strict";

//todo

// sssss cccccc
// уууууу uuuuu
//ффф ааа - ошибка в консоли

//регистро не зависимное сравнение F - f
// aa - bb - cc, после того как ввел aa, появляется bb, потом aa
// дефисы, и др знаки
//когда нажимаем кнопку учить слова, фокус должен сразу переходить на инпут
//длинные слова не помещаются в инпут - "ничего особенного здесь нет"
//тримать ответ

//refactoring
//разбить по файлам

// addEventListener
//  заменить кавычки
//replace alert with text
//лучше перенести в куки, тогда можно переключаться между устройствами
//write tests
//todo запоминание слов - yandex translator API
//todo статистика
//todo кнопка "изучил" (исключить) + можно добавлять слово раз в несколько проходов

window.onload = function() {
    const cyrillicPattern = /^[\u0400-\u04FF]+$/;

    // objects
    function Word(en, ru) {
        this.en = en;
        this.ru = ru;
    }

    // misc
    function unexpectedError(message)
    {
        alert(message);
        throw new Error(message);
    }

    function getElement(id)
    {
        return document.getElementById(id);
    }

    // storage
    function getAllWords()
    {
        const storedWords = localStorage.getItem('words');
        if (storedWords === null) {
            throw new Error('No stored words');
        }

        return JSON.parse(storedWords);
    }

    function hasWords()
    {
        const storedWords = localStorage.getItem('words');
        if (storedWords === null) {
            return false;
        }

        return JSON.parse(storedWords).length > 0;
    }

    function updateWords(words)
    {
        localStorage.setItem('words', JSON.stringify(words));
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

            result.push(
                new Word(
                    !cyrillicPattern.test(wordA[0]) ? wordA : wordB,
                    cyrillicPattern.test(wordA[0]) ? wordA : wordB
                )
            );
        });

        if (result.length === 0) {
            unexpectedError('Invalid input')
        }

        return result;
    }

    //todo rename
    function learnWords(prevWord)
    {
        showWord(getNextWord(prevWord));
    }

    function getNextWord(prevWord)
    {
        const allWords = getAllWords();

        let nextWord = allWords[0];
        if (prevWord !== undefined) {
            const prevWordIndex = allWords.findIndex((word) => word.en === prevWord);
            if (prevWordIndex === -1) {
                throw new Error('previous word index undefined');
            }
            const word = allWords[prevWordIndex + 1];
            if (word !== undefined) {
                nextWord = word;
            }
        }

        return nextWord;
    }

    function showWord(word)
    {
        getElement('new-words-wrapper').classList.add("hidden");

        getElement('word').value = word.ru;
        getElement('correct-answer').value = word.en;
        getElement('user-answer').value = '';
        getElement('learn-word-wrapper').classList.remove("hidden");
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
        const userAnswer = getElement('user-answer').value;
        const correctAnswer = getElement('correct-answer').value;
        if (userAnswer !== correctAnswer) {
            alert('No, try again');
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
}
