// Helper to detect if the application is running inside a Farcaster Mini App.
// In a mini app context, the Farcaster runtime injects a global object
// on the window (e.g. window.farcaster.platform or __FARCASTER_MINIAPP__).
export const isMiniApp = (): boolean => {
  try {
    const win: any = typeof window !== 'undefined' ? window : {};
    return Boolean(win.farcaster?.platform || win.__FARCASTER_MINIAPP__);
  } catch (e) {
    return false;
  }
};