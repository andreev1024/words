import { LearnWord } from './LearnWord.js';
import { getAllWordsOrException, hasWords, updateWords, addWords, getWord, } from './storage.js';
import { parseNewWords, getNextWord } from './word.js';
import { stat } from './stat.js';
import { isHidden, getElement, getInputElement } from './html.js';
import { EditWord } from './EditWord.js';
// todo
// improve parsing
// sssss cccccc
// уууууу uuuuu
//ффф ааа - ошибка в консоли
// дефисы, и др знаки
// FEATURES
// H - когда при edit такое слово уже существует (было аа  и aaa в бд. Обновляю aa на aaa и получаю ошибку)
// H - просмотр статистики (кол-во показов, ошибок). Полезно что бы понимать какие слова стоит взять в сл.сессию
// H - выгрузить оставшиеся слова. Выучил половину набора. Потом хочу переключиться на новый набор. А позже обьединить и делать оба
// M - изучение в контексте предложения
// M - если пытаешся добавить новое слово, но не ввел ни одного, то будет ошибка и Пользователь застрянет на этом
// транскрипции. Иногда важно запомнить произношение
// режим Диктант
// статистика после каждого цикла ИЛИ для сессии ИЛИ все время
//      слова, где допустил ошибки и какие
//      общее кол-во пройденных слов и сколько сделал ошибок
//
// write tests
// лучше перенести в куки, тогда можно переключаться между устройствами
// ADVANCED FEATURES
//запоминание слов - yandex translator API
//верстка под разные утсройства
// REFACTORING
// https://learn.javascript.ru/event-delegation
// replace many files with one (bundling)
// use words collection instead Word[]
// replace duplicates in html
// use state, not html (data attributes, current word)
const initMultilinePlaceholder = () => {
    const textarea = getInputElement('new-words');
    textarea.placeholder = textarea.placeholder.replace(/\\n/g, '\n');
};
const getNewWords = () => {
    const newWords = getElement('new-words').value;
    return parseNewWords(newWords);
};
const showNewWordsSection = () => {
    getInputElement('new-words').value = '';
    getElement('new-words-wrapper').classList.remove('hidden');
    getElement('learn-word-wrapper').classList.add('hidden');
};
const showAnswer = () => {
    const currentWord = getWord(getInputElement('correct-answer').value);
    const wordElement = getInputElement('word');
    wordElement.value =
        wordElement.value === currentWord.ru ? currentWord.en : currentWord.ru;
};
const skipWord = () => {
    const currentWord = getInputElement('correct-answer').value;
    const nextWord = getNextWord(stat, currentWord);
    const allWords = getAllWordsOrException();
    const currentWordIndex = allWords.findIndex((word) => word.en === currentWord);
    if (currentWordIndex === -1) {
        throw new Error("word doesn't exist");
    }
    allWords.splice(currentWordIndex, 1);
    updateWords(allWords);
    allWords.length === 0 ? showNewWordsSection() : LearnWord.show(nextWord);
};
const checkWord = () => {
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
};
const documentKeydownHandler = (event) => {
    if (event.ctrlKey) {
        if (event.key === 'a' && !isHidden(getElement('show-answer'))) {
            showAnswer();
            event.preventDefault();
            return;
        }
        if (event.key === 's' && !isHidden(getElement('skip'))) {
            skipWord();
            return;
        }
    }
};
getElement('reset-storage').addEventListener('click', () => {
    localStorage.removeItem('words');
    showNewWordsSection();
});
getElement('learn').addEventListener('click', () => {
    const newWords = getNewWords();
    if (newWords.length === 0) {
        alert('Invalid input');
        return;
    }
    stat.reset();
    addWords(newWords);
    LearnWord.show(getNextWord(stat));
});
getElement('user-answer').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        checkWord();
    }
});
getElement('check').addEventListener('click', checkWord);
getElement('skip').addEventListener('click', skipWord);
getElement('show-answer').addEventListener('click', showAnswer);
getElement('add-new-words').addEventListener('click', () => showNewWordsSection());
document.addEventListener('keydown', documentKeydownHandler);
initMultilinePlaceholder();
if (hasWords()) {
    LearnWord.show(getNextWord(stat));
}
new LearnWord();
new EditWord();
//# sourceMappingURL=main.js.map