declare global {
  interface Window {
    electron: {
      invoke: <T, R>(channel: string, data?: T) => Promise<R>;
      send: <T>(channel: string, data?: T) => void;
    };
  }
}

export { };