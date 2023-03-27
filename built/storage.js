import { createWords } from './word.js';
export function getAllWordsOrException() {
    const storedWords = getAllWords();
    if (storedWords.length === 0) {
        throw new Error('No stored words');
    }
    return storedWords;
}
function getAllWords() {
    const storedWords = localStorage.getItem('words');
    if (storedWords === null) {
        return [];
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
//todo replace array with Words collection
export function updateWords(words) {
    const newWords = JSON.stringify(createWords(words).unique().toArray());
    localStorage.setItem('words', newWords);
}
export function replaceWord(prevWordKey, newWord) {
    const words = [];
    getAllWordsOrException().forEach((word) => words.push(word.en === prevWordKey ? newWord : word));
    updateWords(words);
}
export function addWords(words) {
    updateWords(getAllWords().concat(words));
}
export function getWord(key) {
    return createWords(getAllWordsOrException()).get(key);
}
export function resetWords() {
    localStorage.removeItem('words');
}
//# sourceMappingURL=storage.js.map