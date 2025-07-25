"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomBytes = void 0;
const utils_1 = require("@noble/hashes/utils");
function randomBytes(length) {
    return (0, utils_1.randomBytes)(length);
}
exports.randomBytes = randomBytes;
//# sourceMappingURL=index.js.map