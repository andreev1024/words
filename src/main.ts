import { AddWords } from './AddWords';
import { LearnWord } from './LearnWord';
import { hasWords } from './storage';
import { getNextWord } from './word';
import { stat } from './stat';
import { getInputElement } from './html';
import { EditWord } from './EditWord';

// todo

// improve parsing
// sssss cccccc
// уууууу uuuuu
//ффф ааа - ошибка в консоли
// дефисы, и др знаки

// FEATURES

// H - версионность для css файлов
// H - webpack hot reload

// если 5 раз подряд написал слово верно не использоваа подсказку - показываем уведомление Молодец
// дашборд с прогрессом, очками, как в rs app

// H - должен работать без интернета
// H - должен работать на разных устройствах (мобила, десктоп) и хранить стейт
// H - когда смотришь подсказуку бывает удобно видеть сразу и перевод
// H - примеры, или изучение в контексте

// H - транскрипция
// H - пишем ответ -> edit -> save -> ответ сбрасывается
// H - просмотр статистики (кол-во показов, ошибок). Полезно что бы понимать какие слова стоит взять в сл.сессию
// статистика после каждого цикла ИЛИ для сессии ИЛИ все время
//      слова, где допустил ошибки и какие
//      общее кол-во пройденных слов и сколько сделал ошибок

// M - изучение в контексте предложения
// M - если пытаешся добавить новое слово, но не ввел ни одного, то будет ошибка и Пользователь застрянет на этом
// M - выгрузить оставшиеся слова. Выучил половину набора. Потом хочу переключиться на новый набор. А позже обьединить и делать оба

// L - когда при edit такое слово уже существует (было аа  и aaa в бд. Обновляю aa на aaa и получаю ошибку)(для этого надо вводить UUID)

// ADVANCED FEATURES
//запоминание слов - yandex translator API
//верстка под разные утсройства

// REFACTORING
// replace many files with one (bundling)
// use words collection instead Word[]
// replace duplicates in html
// use state, not html (data attributes, current word)
// лучше перенести в куки, тогда можно переключаться между устройствами
// write tests

const initMultilinePlaceholder = () => {
    const textarea = getInputElement('new-words');
    textarea.placeholder = textarea.placeholder.replace(/\\n/g, '\n');
};

document.addEventListener('keydown', (event: KeyboardEvent) => {
    if (event.ctrlKey) {
        if (LearnWord.isActive()) {
            if (event.code === 'KeyA') {
                LearnWord.showAnswer();
                event.preventDefault();
                return;
            }
            if (event.code === 'KeyS') {
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
