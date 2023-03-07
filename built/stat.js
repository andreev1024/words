export const createStat = () => ({
    items: {},
    add(key) {
        if (this.items[key] === undefined) {
            this.items[key] = createStatItem();
        }
        this.items[key].inc(key);
    },
    get(key) {
        return this.items[key];
    }
});
const createStatItem = () => ({
    shows: 0,
    inc() {
        this.shows++;
    }
});
//# sourceMappingURL=stat.js.map