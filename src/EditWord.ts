import { stat } from './stat';
import { LearnWord } from './LearnWord';
import { getInputElement, getElement, show, hide } from './html';
import { replaceWord } from './storage';
import { createWord, Word } from './word';

export class EditWord {
  #elem: HTMLElement;

  constructor() {
    this.#elem = getElement('edit-word-wrapper');
    this.#elem.onclick = this.#onClick.bind(this);
  }

  static show(word: Word): void {
    const translationElement = EditWord.#getTranslationElement();
    translationElement.dataset.prev = word.ru;
    translationElement.value = word.ru;

    const titleElement = EditWord.#getTitleElement();
    titleElement.dataset.prev = word.en;
    titleElement.value = word.en;

    show(getInputElement('edit-word-wrapper'));
  }

  #onClick(event: any) {
    const action = event.target?.dataset?.action;
    if (action === 'save') {
      this.#save();
    }
  }

  #save(): void {
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

  static #hide(): void {
    hide(getInputElement('edit-word-wrapper'));
  }

  static #getTranslationElement(): HTMLInputElement {
    return getInputElement('edit-word-translation');
  }

  static #getTitleElement(): HTMLInputElement {
    return getInputElement('edit-word-title');
  }
}
