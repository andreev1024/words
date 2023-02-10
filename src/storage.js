import {ONE_BY_ONE_MODE, allModes} from './mode.js';

export function getAllWords() {
    const storedWords = localStorage.getItem('words');
    if (storedWords === null) {
        throw new Error('No stored words');
    }

    return JSON.parse(storedWords);
}

export function hasWords() {
    const storedWords = localStorage.getItem('words');
    if (storedWords === null) {
        return false;
    }

    return JSON.parse(storedWords).length > 0;
}

export function updateWords(words) {
    localStorage.setItem('words', JSON.stringify(words));
}

export function getMode()
{
    return localStorage.getItem('mode') ?? ONE_BY_ONE_MODE;
}

export function updateMode(mode)
{
    if (!allModes.includes(mode)) {
        throw new Error('invalid mode');
    }
    localStorage.setItem('mode', mode);
}
