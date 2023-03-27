import { AddWords } from './AddWords.js';
import { LearnWord } from './LearnWord.js';
import { hasWords } from './storage.js';
import { getNextWord } from './word.js';
import { stat } from './stat.js';
import { getInputElement } from './html.js';
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

document.addEventListener('keydown', (event: KeyboardEvent) => {
    if (event.ctrlKey) {
        if (LearnWord.isActive()) {
            if (event.key === 'a') {
                LearnWord.showAnswer();
                event.preventDefault();
                return;
            }
            if (event.key === 's') {
                LearnWord.skipWord();
                return;
            }
        }
    }
});

initMultilinePlaceholder();

if (hasWords()) {
    LearnWord.show(getNextWord(stat));
}

new AddWords();
new LearnWord();
new EditWord();
