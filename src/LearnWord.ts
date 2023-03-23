import { Word } from './word';
import { currentWord } from './state.js';
import { getInputElement, hide, getElement } from './html.js';
import { EditWord } from './EditWord.js';

export class LearnWord {
    #elem: HTMLElement;

    constructor() {
        this.#elem = getElement('learn-word-wrapper');
        this.#elem.onclick = this.#onClick.bind(this);
    }

    static show(word: Word): void {
        getElement('new-words-wrapper').classList.add('hidden');

        getInputElement('word').value = word.ru;
        getInputElement('correct-answer').value = word.en;

        const userAnswerInputElement = getInputElement('user-answer');
        userAnswerInputElement.value = '';
        getElement('learn-word-wrapper').classList.remove('hidden');
        userAnswerInputElement.focus();
    }

    #edit(): void {
        LearnWord.#hide();
        EditWord.show(currentWord());
    }

    #onClick(event: any) {
        const action = event.target?.dataset?.action;
        if (action === 'edit') {
            this.#edit();
        }
    }

    static #hide(): void {
        hide(getInputElement('learn-word-wrapper'));
    }
}
