import { getAllWordsOrException, getMode } from './storage.js';
import { RANDOM_MODE } from './mode.js';
import { Stat } from './stat.js';

const cyrillicPattern = /^[\u0400-\u04FF]+$/;

export type Word = {
    en: string;
    ru: string;
};

export const createWord = (en: string, ru: string): Word => ({
    en: en,
    ru: ru,
});

type Words = {
    items: Word[];
    unique: () => Words;
    toArray: () => Word[];
    get: (key: string) => Word;
    find: (key: string) => undefined | Word;
};

export const createWords = (words: Word[]): Words => ({
    items: words,
    unique() {
        const uniqueWords: Record<string, Word> = {};
        this.items.forEach((word: Word) => {
            uniqueWords[word.en] = word;
        });
        return createWords(Object.values(uniqueWords));
    },
    toArray() {
        return this.items;
    },
    get(key: string): Word {
        const value = this.find(key);
        if (value) {
            return value;
        }

        throw new Error('Word does not exist');
    },
    find(key: string): undefined | Word {
        return this.items.find((word: Word) => word.en === key);
    },
});

function unexpectedError(message: string): never {
    alert(message);
    throw new Error(message);
}

export function parseNewWords(input: string): Word[] {
    const result: Word[] = [];
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
        let lang: null | string = null;
        let anotherLangCharIndex: null | number = null;
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

        result.push(
            createWord(
                !cyrillicPattern.test(wordA[0]) ? wordA : wordB,
                cyrillicPattern.test(wordA[0]) ? wordA : wordB
            )
        );
    });

    if (result.length === 0) {
        unexpectedError('Invalid input');
    }

    return result;
}

export function getNextWord(stat: Stat, prevWord?: string): Word {
    let allWords = getAllWordsOrException();
    let nextWord = allWords[0];
    if (allWords.length === 1) {
        return nextWord;
    }

    let prevWordIndex;
    if (prevWord !== undefined) {
        prevWordIndex = allWords.findIndex((word: any) => word.en === prevWord);
        if (prevWordIndex === -1) {
            throw new Error('previous word index undefined');
        }
    }

    if (prevWordIndex !== undefined) {
        const word = allWords[prevWordIndex + 1];
        if (word !== undefined) {
            nextWord = word;
        }
    }

    if (getMode() === RANDOM_MODE) {
        if (prevWordIndex !== undefined) {
            allWords.splice(prevWordIndex, 1);
            const minShows = Math.min(
                ...allWords.map((word: Word) => stat.get(word.en)?.shows ?? 0)
            );
            const words: Word[] = [];
            allWords.forEach((word: Word) => {
                const shows = stat.get(word.en)?.shows ?? 0;
                if (shows - minShows < 1) {
                    words.push(word);
                }
            });
            allWords = words;
        }

        nextWord = allWords[Math.floor(Math.random() * allWords.length)];
    }

    return nextWord;
}
