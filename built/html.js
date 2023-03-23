export const isHidden = (element) => element.offsetParent === null;
export const getElement = (id) => {
    const element = document.getElementById(id);
    if (element === null) {
        throw new Error();
    }
    return element;
};
export const getInputElement = (id) => getElement(id);
export const hide = (elem) => {
    elem.classList.add('hidden');
};
export const show = (elem) => {
    elem.classList.remove('hidden');
};
//# sourceMappingURL=html.js.map