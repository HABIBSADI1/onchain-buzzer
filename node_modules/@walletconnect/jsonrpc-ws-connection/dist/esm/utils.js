export const resolveWebSocketImplementation = () => {
    if (typeof global !== "undefined" && typeof global.WebSocket !== "undefined") {
        return global.WebSocket;
    }
    if (typeof window !== "undefined" && typeof window.WebSocket !== "undefined") {
        return window.WebSocket;
    }
    return require("ws");
};
export const isBrowser = () => typeof window !== "undefined";
export const truncateQuery = (wssUrl) => wssUrl.split("?")[0];
//# sourceMappingURL=utils.js.map