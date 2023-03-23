import { currentWord } from './state.js';
import { getInputElement, hide, getElement } from './html.js';
import { EditWord } from './EditWord.js';
export class LearnWord {
    #elem;
    constructor() {
        this.#elem = getElement('learn-word-wrapper');
        this.#elem.onclick = this.#onClick.bind(this);
    }
    static show(word) {
        getElement('new-words-wrapper').classList.add('hidden');
        getInputElement('word').value = word.ru;
        getInputElement('correct-answer').value = word.en;
        const userAnswerInputElement = getInputElement('user-answer');
        userAnswerInputElement.value = '';
        getElement('learn-word-wrapper').classList.remove('hidden');
        userAnswerInputElement.focus();
    }
    #edit() {
        LearnWord.#hide();
        EditWord.show(currentWord());
    }
    #onClick(event) {
        const action = event.target?.dataset?.action;
        if (action === 'edit') {
            this.#edit();
        }
    }
    static #hide() {
        hide(getInputElement('learn-word-wrapper'));
    }
}
//# sourceMappingURL=LearnWord.js.map