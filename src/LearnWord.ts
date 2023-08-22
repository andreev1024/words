import { Word, getNextWord } from './word.js';
import { currentWord } from './state.js';
import { getInputElement, hide, getElement, show, isHidden } from './html.js';
import { EditWord } from './EditWord.js';
import { getWord, getAllWordsOrException, updateWords, resetWords } from './storage.js';
import { stat } from './stat.js';

export class LearnWord {
    #elem: HTMLElement;

    constructor() {
        this.#elem = getElement('learn-word-wrapper');
        this.#elem.onclick = this.#onClick.bind(this);
        this.#elem.onkeydown = this.#onKeyDown.bind(this);
    }

    static show(word: Word): void {
        hide(getElement('new-words-wrapper'));

        getInputElement('word').value = word.ru;
        getInputElement('correct-answer').value = word.en;

        const userAnswerInputElement = getInputElement('user-answer');
        userAnswerInputElement.value = '';
        show(getElement('learn-word-wrapper'));
        userAnswerInputElement.focus();
    }

    static isActive(): boolean {
        return !isHidden(getElement('learn-word-wrapper'));
    }

    static showAnswer(): void {
        const currentWord = getWord(getInputElement('correct-answer').value);
        const wordElement = getInputElement('word');
        wordElement.value = wordElement.value === currentWord.ru ? currentWord.en : currentWord.ru;
    }

    static skipWord(): void {
        const currentWord = getInputElement('correct-answer').value;
        const nextWord = getNextWord(stat, currentWord);
        const allWords = getAllWordsOrException();

        const currentWordIndex = allWords.findIndex((word) => word.en === currentWord);
        if (currentWordIndex === -1) {
            throw new Error("word doesn't exist");
        }

        allWords.splice(currentWordIndex, 1);
        updateWords(allWords);

        allWords.length === 0 ? LearnWord.#showNewWordsSection() : LearnWord.show(nextWord);
    }

    static #showNewWordsSection(): void {
        getInputElement('new-words').value = '';
        show(getElement('new-words-wrapper'));
        hide(getElement('learn-word-wrapper'));
    }

    static #resetStorage(): void {
        resetWords();
        LearnWord.#showNewWordsSection();
    }

    static #edit(): void {
        LearnWord.#hide();
        EditWord.show(currentWord());
    }

    static #checkWord(): void {
        const userAnswerElement = getInputElement('user-answer');
        const userAnswer = userAnswerElement.value;
        const correctAnswer = getInputElement('correct-answer').value;
        if (userAnswer.trim().toLowerCase() !== correctAnswer.toLowerCase()) {
            userAnswerElement.classList.add('red');
            setTimeout(() => getElement('user-answer').classList.remove('red'), 1000);
            return;
        }

        stat.add(correctAnswer);

        const nextWord = getNextWord(stat, correctAnswer);
        LearnWord.show(nextWord);
    }

    #onClick(event: any) {
        const handlers: { [key: string]: { (): void } } = {
            edit: LearnWord.#edit,
            'show-answer': LearnWord.showAnswer,
            'add-new-words': LearnWord.#showNewWordsSection,
            skip: LearnWord.skipWord,
            'reset-storage': LearnWord.#resetStorage,
            check: LearnWord.#checkWord,
        };

        let action;
        for (const key in handlers) {
            if (event.target.closest(`[data-action="${key}"]`)) {
                action = key;
                break;
            }
        }

        if (!action) {
            return;
        }

        const fn = handlers[action];
        if (fn) {
            fn();
        }
    }

    #onKeyDown(event: any) {
        if (event.target.id === 'user-answer' && event.key === 'Enter') {
            LearnWord.#checkWord();
        }
    }

    static #hide(): void {
        hide(getInputElement('learn-word-wrapper'));
    }
}
