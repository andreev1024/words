export type Stat = {
    items: Record<string, StatItem>,
    add: (key: string) => void,
    get: (key: string) => undefined | StatItem
}

export const createStat = (): Stat => ({
    items: {},
    add(key: string) {
        if (this.items[key] === undefined) {
            this.items[key] = createStatItem();
        }
        this.items[key].inc(key);
    },
    get(key: string) {
        return this.items[key];
    }
})

type StatItem = {
    shows: number,
    inc(key: string): void
}

const createStatItem = () => ({
    shows: 0,
    inc(): void {
        this.shows++;
    }
})
