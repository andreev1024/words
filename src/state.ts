import { getInputElement } from './html.js';
import { getWord } from './storage.js';

//todo user real state, not html
export const currentWord = () => getWord(getInputElement('correct-answer').value);
