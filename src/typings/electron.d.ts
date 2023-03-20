declare global {
  interface Window {
    electron: {
      invoke: <T>(channel: string, data?: T) => Promise<T>;
      send: <T>(channel: string, data?: T) => void;
    };
  }
}

export { };