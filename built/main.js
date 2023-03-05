import { getAllWordsOrException, hasWords, updateWords, updateMode, addWords, getWord } from './storage.js';
import { parseNewWords, getNextWord } from './word.js';
import { createStat } from './stat.js';
// todo
// improve parsing
// sssss cccccc
// уууууу uuuuu
//ффф ааа - ошибка в консоли
// дефисы, и др знаки
// FEATURES
// H - улучшить рандомайзер. Он должен давать слова более равномерно
//      D   добавить статистику
//      *   улучшить рандомайзер
// H - use words collection
// выгрузить оставшиеся слова. Выучил половину набора. Потом хочу переключиться на новый набор. А позже обьединить и делать оба
// H - поддержка одинаковых слов. Например, relief может иметь разные значения в зависимости от контекста. Уникальность должна проверятся по паре слов en-ru
// H - изучение в контексте предложения
// M - при нажатии кнопка Show answer сначала показать подсказку а при повторном нажатии скрывать
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
// replace many files with one (bundling)
function isHidden(element) {
    return element.offsetParent === null;
}
function getElement(id) {
    const element = document.getElementById(id);
    if (element === null) {
        throw new Error();
    }
    return element;
}
function getInputElement(id) {
    return getElement(id);
}
function getNewWords() {
    const newWords = getElement('new-words').value;
    return parseNewWords(newWords);
}
function showWord(word) {
    getElement('new-words-wrapper').classList.add('hidden');
    getInputElement('word').value = word.ru;
    getInputElement('correct-answer').value = word.en;
    const userAnswerInput = getInputElement('user-answer');
    userAnswerInput.value = '';
    getElement('learn-word-wrapper').classList.remove('hidden');
    userAnswerInput.focus();
}
function showNewWordsSection() {
    getInputElement('new-words').value = '';
    getElement('new-words-wrapper').classList.remove('hidden');
    getElement('learn-word-wrapper').classList.add('hidden');
}
function makeMultilinePlaceholder() {
    const textarea = getInputElement('new-words');
    textarea.placeholder = textarea.placeholder.replace(/\\n/g, '\n');
}
getElement('reset-storage').addEventListener('click', () => {
    localStorage.removeItem('words');
    showNewWordsSection();
});
getElement('check').addEventListener('click', () => {
    const userAnswerElement = getInputElement('user-answer');
    const userAnswer = userAnswerElement.value;
    const correctAnswer = getInputElement('correct-answer').value;
    if (userAnswer.trim().toLowerCase() !== correctAnswer.toLowerCase()) {
        userAnswerElement.classList.add('red');
        setTimeout(() => getElement('user-answer').classList.remove('red'), 1000);
        return;
    }
    stat.add(correctAnswer);
    const nextWord = getNextWord(correctAnswer);
    showWord(nextWord);
    return;
});
getElement('learn').addEventListener('click', () => {
    const newWords = getNewWords();
    if (newWords.length === 0) {
        alert('Invalid input');
        return;
    }
    stat = createStat();
    addWords(newWords);
    showWord(getNextWord());
});
getElement('user-answer').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        getElement('check').click();
    }
});
getElement('skip').addEventListener('click', () => {
    const currentWord = getInputElement('correct-answer').value;
    const nextWord = getNextWord(currentWord);
    const allWords = getAllWordsOrException();
    const currentWordIndex = allWords.findIndex((word) => word.en === currentWord);
    if (currentWordIndex === -1) {
        throw new Error("word doesn't exist");
    }
    allWords.splice(currentWordIndex, 1);
    updateWords(allWords);
    allWords.length === 0
        ? showNewWordsSection()
        : showWord(nextWord);
});
getElement('mode').addEventListener('change', (event) => {
    updateMode(event.target.value);
});
getElement('show-answer').addEventListener('click', () => {
    const currentWord = getWord(getInputElement('correct-answer').value);
    const wordElement = getInputElement('word');
    wordElement.value = wordElement.value === currentWord.ru ? currentWord.en : currentWord.ru;
});
document.addEventListener('keydown', (event) => {
    if (event.ctrlKey) {
        const showAnswerElement = getElement('show-answer');
        if (event.key === 'a' && !isHidden(showAnswerElement)) {
            showAnswerElement.click();
            return;
        }
        const skipElement = getElement('skip');
        if (event.key === 's' && !isHidden(skipElement)) {
            skipElement.click();
            return;
        }
    }
});
getElement('add-new-words').addEventListener('click', () => {
    showNewWordsSection();
});
makeMultilinePlaceholder();
let stat = createStat();
if (hasWords()) {
    showWord(getNextWord());
}
//# sourceMappingURL=main.js.map