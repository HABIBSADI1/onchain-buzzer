import { cbc } from "@noble/ciphers/aes";
import { hmac } from "@noble/hashes/hmac";
import { sha256 } from "@noble/hashes/sha256";
import { sha512 } from "@noble/hashes/sha512";
import { ripemd160 } from "@noble/hashes/ripemd160";
export function fallbackAesEncrypt(iv, key, data) {
    return cbc(key, iv).encrypt(data);
}
export function fallbackAesDecrypt(iv, key, data) {
    return cbc(key, iv).decrypt(data);
}
export function fallbackHmacSha256Sign(key, data) {
    return hmac(sha256, key, data);
}
export function fallbackHmacSha512Sign(key, data) {
    return hmac(sha512, key, data);
}
export function fallbackSha256(msg) {
    return sha256(msg);
}
export function fallbackSha512(msg) {
    return sha512(msg);
}
export function fallbackRipemd160(msg) {
    return ripemd160(msg);
}
//# sourceMappingURL=fallback.js.map