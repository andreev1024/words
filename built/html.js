export const isHidden = (element) => element.offsetParent === null;
export const getElement = (id) => {
    const element = document.getElementById(id);
    if (element === null) {
        throw new Error();
    }
    return element;
};
export const getInputElement = (id) => getElement(id);
//# sourceMappingURL=html.js.map