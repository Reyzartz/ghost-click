import { Logger } from "./Logger";

export class Storage {
  private readonly logger: Logger;
  private readonly area: chrome.storage.StorageArea;

  constructor(area: chrome.storage.StorageArea = chrome.storage.local) {
    this.logger = new Logger("Storage");
    this.area = area;
  }

  async set<T>(key: string, value: T): Promise<void> {
    return new Promise((resolve, reject) => {
      this.area.set({ [key]: value }, () => {
        const err = chrome.runtime.lastError;
        if (err) {
          this.logger.error("Failed to set item", { key, err });
          reject(err);
          return;
        }

        resolve();
      });
    });
  }

  async get<T>(key: string): Promise<T | null> {
    return new Promise((resolve, reject) => {
      this.area.get(key, (items) => {
        const err = chrome.runtime.lastError;
        if (err) {
          this.logger.error("Failed to get item", { key, err });
          reject(err);
          return;
        }

        const item = (items[key] as T) ?? null;
        resolve(item);
      });
    });
  }

  async remove(key: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.area.remove(key, () => {
        const err = chrome.runtime.lastError;
        if (err) {
          this.logger.error("Failed to remove item", { key, err });
          reject(err);
          return;
        }

        resolve();
      });
    });
  }

  async clearAll(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.area.clear(() => {
        const err = chrome.runtime.lastError;
        if (err) {
          this.logger.error("Failed to clear storage", { err });
          reject(err);
          return;
        }

        resolve();
      });
    });
  }
}
