import { stat } from './stat.js';
import { LearnWord } from './LearnWord.js';
import { getInputElement, getElement, show, hide } from './html.js';
import { replaceWord } from './storage.js';
import { createWord } from './word.js';
export class EditWord {
    #elem;
    constructor() {
        this.#elem = getElement('edit-word-wrapper');
        this.#elem.onclick = this.#onClick.bind(this);
    }
    static show(word) {
        const translationElement = EditWord.#getTranslationElement();
        translationElement.dataset.prev = word.ru;
        translationElement.value = word.ru;
        const titleElement = EditWord.#getTitleElement();
        titleElement.dataset.prev = word.en;
        titleElement.value = word.en;
        show(getInputElement('edit-word-wrapper'));
    }
    #onClick(event) {
        const action = event.target?.dataset?.action;
        if (action === 'save') {
            this.#save();
        }
    }
    #save() {
        const translation = EditWord.#getTranslationElement();
        const title = EditWord.#getTitleElement();
        const prevTitle = title.dataset.prev;
        const prevTranslation = translation.dataset.prev;
        const newWord = createWord(title.value, translation.value);
        //todo assert
        if (prevTitle === undefined || prevTranslation === undefined) {
            throw new Error();
        }
        if (prevTitle !== title.value || prevTranslation !== translation.value) {
            //todo предотвратить перезапись другого слова (такое слово уже может быть в наборе)
            replaceWord(prevTitle, newWord);
            stat.updateKey(prevTitle, title.value);
        }
        LearnWord.show(newWord);
        EditWord.#hide();
    }
    static #hide() {
        hide(getInputElement('edit-word-wrapper'));
    }
    static #getTranslationElement() {
        return getInputElement('edit-word-translation');
    }
    static #getTitleElement() {
        return getInputElement('edit-word-title');
    }
}
//# sourceMappingURL=EditWord.js.map