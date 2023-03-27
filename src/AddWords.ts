import { LearnWord } from './LearnWord.js';
import { stat } from './stat.js';
import { getElement } from './html.js';
import { getNextWord, parseNewWords } from './word.js';
import { addWords } from './storage.js';

export class AddWords {
    #elem: HTMLElement;

    constructor() {
        this.#elem = getElement('new-words-wrapper');
        this.#elem.onclick = this.#onClick.bind(this);
    }

    #learn(): void {
        const newWords = parseNewWords(
            (getElement('new-words') as HTMLInputElement).value
        );

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
