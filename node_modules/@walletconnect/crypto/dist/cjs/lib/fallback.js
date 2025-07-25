"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fallbackRipemd160 = exports.fallbackSha512 = exports.fallbackSha256 = exports.fallbackHmacSha512Sign = exports.fallbackHmacSha256Sign = exports.fallbackAesDecrypt = exports.fallbackAesEncrypt = void 0;
const aes_1 = require("@noble/ciphers/aes");
const hmac_1 = require("@noble/hashes/hmac");
const sha256_1 = require("@noble/hashes/sha256");
const sha512_1 = require("@noble/hashes/sha512");
const ripemd160_1 = require("@noble/hashes/ripemd160");
function fallbackAesEncrypt(iv, key, data) {
    return (0, aes_1.cbc)(key, iv).encrypt(data);
}
exports.fallbackAesEncrypt = fallbackAesEncrypt;
function fallbackAesDecrypt(iv, key, data) {
    return (0, aes_1.cbc)(key, iv).decrypt(data);
}
exports.fallbackAesDecrypt = fallbackAesDecrypt;
function fallbackHmacSha256Sign(key, data) {
    return (0, hmac_1.hmac)(sha256_1.sha256, key, data);
}
exports.fallbackHmacSha256Sign = fallbackHmacSha256Sign;
function fallbackHmacSha512Sign(key, data) {
    return (0, hmac_1.hmac)(sha512_1.sha512, key, data);
}
exports.fallbackHmacSha512Sign = fallbackHmacSha512Sign;
function fallbackSha256(msg) {
    return (0, sha256_1.sha256)(msg);
}
exports.fallbackSha256 = fallbackSha256;
function fallbackSha512(msg) {
    return (0, sha512_1.sha512)(msg);
}
exports.fallbackSha512 = fallbackSha512;
function fallbackRipemd160(msg) {
    return (0, ripemd160_1.ripemd160)(msg);
}
exports.fallbackRipemd160 = fallbackRipemd160;
//# sourceMappingURL=fallback.js.map