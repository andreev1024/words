export const isHidden = (element: HTMLElement): boolean => element.offsetParent === null;

export const getElement = (id: string): HTMLElement => {
    const element = document.getElementById(id);
    if (element === null) {
        throw new Error();
    }
    return element;
};

export const getInputElement = (id: string): HTMLInputElement =>
    getElement(id) as HTMLInputElement;

export const hide = (elem: HTMLElement) => {
    elem.classList.add('hidden');
};

export const show = (elem: HTMLElement) => {
    elem.classList.remove('hidden');
};
