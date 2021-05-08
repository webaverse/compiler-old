if (typeof globalThis.process === 'undefined') {
  globalThis.process = {
    env: {},
  };
}