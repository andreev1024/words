import { getAllWordsOrException } from './storage.js';
const cyrillicPattern = /^[\u0400-\u04FF]+$/;
export const createWord = (en, ru) => ({
    en: en,
    ru: ru,
});
export const createWords = (words) => ({
    items: words,
    unique() {
        const uniqueWords = {};
        this.items.forEach((word) => {
            uniqueWords[word.en] = word;
        });
        return createWords(Object.values(uniqueWords));
    },
    toArray() {
        return this.items;
    },
    get(key) {
        const value = this.find(key);
        if (value) {
            return value;
        }
        throw new Error('Word does not exist');
    },
    find(key) {
        return this.items.find((word) => word.en === key);
    },
});
function unexpectedError(message) {
    alert(message);
    throw new Error(message);
}
export function parseNewWords(input) {
    const result = [];
    if (input.trim() === '') {
        return result;
    }
    const rows = input.split('\n');
    rows.forEach(function (rawRow) {
        //todo смена языка должна быть один раз
        const row = rawRow.trim();
        if (row === '') {
            return;
        }
        let lang = null;
        let anotherLangCharIndex = null;
        [...row].forEach(function (value, index) {
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
                    unexpectedError('Invalid input');
                }
                anotherLangCharIndex = index;
                return;
            }
        });
        if (typeof anotherLangCharIndex !== 'number') {
            unexpectedError('Invalid input');
        }
        const wordA = row.substring(0, anotherLangCharIndex).trim();
        const wordB = row.substring(anotherLangCharIndex).trim();
        result.push(createWord(!cyrillicPattern.test(wordA[0]) ? wordA : wordB, cyrillicPattern.test(wordA[0]) ? wordA : wordB));
    });
    if (result.length === 0) {
        unexpectedError('Invalid input');
    }
    return result;
}
export function getNextWord(stat, prevWord) {
    let allWords = getAllWordsOrException();
    let nextWord = allWords[0];
    if (allWords.length === 1) {
        return nextWord;
    }
    let prevWordIndex;
    if (prevWord !== undefined) {
        prevWordIndex = allWords.findIndex((word) => word.en === prevWord);
        if (prevWordIndex === -1) {
            throw new Error('previous word index undefined');
        }
    }
    if (prevWordIndex !== undefined) {
        allWords.splice(prevWordIndex, 1);
        const minShows = Math.min(...allWords.map((word) => stat.get(word.en)?.shows ?? 0));
        const words = [];
        allWords.forEach((word) => {
            const shows = stat.get(word.en)?.shows ?? 0;
            if (shows - minShows < 1) {
                words.push(word);
            }
        });
        allWords = words;
    }
    nextWord = allWords[Math.floor(Math.random() * allWords.length)];
    return nextWord;
}
export function wordsEqual(a, b) {
    return normalize(a) === normalize(b);
}
function normalize(word) {
    const toBeForms = [
        [/['’`]m/gi, ' am'],
        [/['’`]s/gi, ' is'],
        [/['’`]re/gi, ' are'], // You are - you're
    ];
    toBeForms.forEach(([pattern, replacement]) => {
        word = word.replace(pattern, replacement);
    });
    const tensesForms = [
        [/['’`]ll/gi, ' will'], // I will - I'll
    ];
    tensesForms.forEach(([pattern, replacement]) => {
        word = word.replace(pattern, replacement);
    });
    const replaceMultipleSpaces = /\s+/g;
    word = word.replace(replaceMultipleSpaces, ' ');
    word = word.trim().toLowerCase();
    return word;
}
//# sourceMappingURL=word.js.map