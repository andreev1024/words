import { getInputElement } from './html';
import { getWord } from './storage';

//todo user real state, not html
export const currentWord = () => getWord(getInputElement('correct-answer').value);
