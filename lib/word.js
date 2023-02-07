import {getAllWords} from './storage.js';

const cyrillicPattern = /^[\u0400-\u04FF]+$/;

function Word(en, ru) {
    this.en = en;
    this.ru = ru;
}

function unexpectedError(message)
{
    alert(message);
    throw new Error(message);
}

export function parseNewWords(input)
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

export function getNextWord(prevWord)
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