import {ONE_BY_ONE_MODE, allModes} from './mode.js';
import { createWords, Word } from './word.js';

export function getAllWordsOrException(): Word[] {
    const storedWords = getAllWords();
    if (storedWords.length === 0) {
        throw new Error('No stored words');
    }

    return storedWords;
}

function getAllWords(): Word[]
{
    const storedWords = localStorage.getItem('words');
    if (storedWords === null) {
        return [];
    }

    return JSON.parse(storedWords);
}

export function hasWords(): boolean
{
    const storedWords = localStorage.getItem('words');
    if (storedWords === null) {
        return false;
    }

    return JSON.parse(storedWords).length > 0;
}

//todo replace array with Words collection
export function updateWords(words: Word[]) {

    const newWords = JSON.stringify(createWords(words).unique().toArray());
    localStorage.setItem('words', newWords);
}

export function addWords(words: Word[]) {
    updateWords(getAllWords().concat(words));
}

//todo replace with enum
export function getMode(): string
{
    return localStorage.getItem('mode') ?? ONE_BY_ONE_MODE;
}

export function updateMode(mode: string): void
{
    if (!allModes.includes(mode)) {
        throw new Error('invalid mode');
    }
    localStorage.setItem('mode', mode);
}
