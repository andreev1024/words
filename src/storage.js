export function getAllWords()
{
    const storedWords = localStorage.getItem('words');
    if (storedWords === null) {
        throw new Error('No stored words');
    }

    return JSON.parse(storedWords);
}

export function hasWords()
{
    const storedWords = localStorage.getItem('words');
    if (storedWords === null) {
        return false;
    }

    return JSON.parse(storedWords).length > 0;
}

export function updateWords(words)
{
    localStorage.setItem('words', JSON.stringify(words));
}
