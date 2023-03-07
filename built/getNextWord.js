import { getAllWordsOrException, getMode } from './storage.js';
import { RANDOM_MODE } from './mode.js';
export function getNextWord(prevWord, stat) {
    let allWords = getAllWordsOrException();
    let prevWordIndex;
    if (prevWord !== undefined) {
        prevWordIndex = allWords.findIndex((word) => word.en === prevWord);
        if (prevWordIndex === -1) {
            throw new Error('previous word index undefined');
        }
    }
    let nextWord = allWords[0];
    if (prevWordIndex !== undefined) {
        const word = allWords[prevWordIndex + 1];
        if (word !== undefined) {
            nextWord = word;
        }
    }
    if (getMode() === RANDOM_MODE) {
        if (prevWordIndex !== undefined && allWords.length > 1) {
            allWords.splice(prevWordIndex, 1);
            let minShows = 0;
            const words = [];
            allWords.forEach((word) => {
                const statItem = stat.get(word.en);
                if (!statItem) {
                    return;
                }
                if (statItem.shows < minShows) {
                    minShows = statItem.shows;
                }
                if ((statItem.shows - minShows) < 2) {
                    return;
                }
                words.push(word);
            });
            allWords = words;
        }
        nextWord = allWords[Math.floor(Math.random() * allWords.length)];
    }
    return nextWord;
}
//# sourceMappingURL=getNextWord.js.map