import createWebStorage from "redux-persist/lib/storage/createWebStorage";

type NoopStorage = {
  getItem: (key: string) => Promise<null>;
  setItem: (key: string, value: string) => Promise<string>;
  removeItem: (key: string) => Promise<void>;
};

const createNoopStorage = (): NoopStorage => {
  return {
    getItem(_key: string): Promise<null> {
      console.log(_key);
      return Promise.resolve(null);
    },
    setItem(_key: string, value: string): Promise<string> {
      console.log(_key);
      return Promise.resolve(value);
    },
    removeItem(_key: string): Promise<void> {
      console.log(_key);
      return Promise.resolve();
    },
  };
};

const storage =
  typeof window === "undefined" ? createNoopStorage() : createWebStorage("local");

export default storage;
