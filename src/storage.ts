// storage.ts
export const save = <T>(key: string, value: T) =>
  chrome.storage.local.set({ [key]: value });

export const load = <T>(key: string): Promise<T | undefined> =>
  new Promise((res) => {
    chrome.storage.local.get(key, (o) => res(o[key]));
  });
