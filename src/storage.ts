import { createWords, Word } from './word.js';

export function getAllWordsOrException(): Word[] {
    const storedWords = getAllWords();
    if (storedWords.length === 0) {
        throw new Error('No stored words');
    }

    return storedWords;
}

function getAllWords(): Word[] {
    const storedWords = localStorage.getItem('words');
    if (storedWords === null) {
        return [];
    }

    return JSON.parse(storedWords);
}

export function hasWords(): boolean {
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

export function replaceWord(prevWordKey: string, newWord: Word): void {
    const words: Word[] = [];
    getAllWordsOrException().forEach((word: Word) =>
        words.push(word.en === prevWordKey ? newWord : word)
    );
    updateWords(words);
}

export function addWords(words: Word[]) {
    updateWords(getAllWords().concat(words));
}

export function getWord(key: string): Word {
    return createWords(getAllWordsOrException()).get(key);
}

export function resetWords(): void {
    localStorage.removeItem('words');
}
