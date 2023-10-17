import { LearnWord } from './LearnWord';
import { stat } from './stat';
import { getElement } from './html';
import { getNextWord, parseNewWords } from './word';
import { addWords } from './storage';

export class AddWords {
  #elem: HTMLElement;

  constructor() {
    this.#elem = getElement('new-words-wrapper');
    this.#elem.onclick = this.#onClick.bind(this);
  }

  #learn(): void {
    const newWords = parseNewWords((getElement('new-words') as HTMLInputElement).value);

    if (newWords.length === 0) {
      alert('Invalid input');
      return;
    }

    stat.reset();

    addWords(newWords);
    LearnWord.show(getNextWord(stat));
  }

  #onClick(event: any) {
    const action = event.target?.dataset?.action;
    if (action === 'learn') {
      this.#learn();
    }
  }
}
