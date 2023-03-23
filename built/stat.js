const createStatItem = () => ({
    shows: 0,
    inc() {
        this.shows++;
    },
});
// singletone
export const stat = {
    items: {},
    add(key) {
        if (this.items[key] === undefined) {
            this.items[key] = createStatItem();
        }
        this.items[key].inc(key);
    },
    get(key) {
        return this.items[key];
    },
    reset() {
        this.items = {};
    },
    updateKey(prevKey, newKey) {
        if (prevKey === newKey) {
            return;
        }
        const item = this.get(prevKey);
        if (!item) {
            return;
        }
        //todo предотвратить перезапись другого слова (такое слово уже может быть в наборе)
        // if (this.get(newKey)) {
        //     throw new Error('such key already exist');
        // }
        this.items[newKey] = item;
        delete this.items[prevKey];
    },
};
//# sourceMappingURL=stat.js.map