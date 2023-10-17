type StatItem = {
  shows: number;
  inc(key: string): void;
};

const createStatItem = (): StatItem => ({
  shows: 0,
  inc(): void {
    this.shows++;
  },
});

export type Stat = {
  items: Record<string, StatItem>;
  add: (key: string) => void;
  get: (key: string) => undefined | StatItem;
  reset: () => void;
  updateKey: (prevKey: string, newKey: string) => void;
};

// singletone
export const stat: Stat = {
  items: {},
  add(key: string): void {
    if (this.items[key] === undefined) {
      this.items[key] = createStatItem();
    }
    this.items[key].inc(key);
  },
  get(key: string): undefined | StatItem {
    return this.items[key];
  },
  reset(): void {
    this.items = {};
  },
  updateKey(prevKey: string, newKey: string): void {
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
