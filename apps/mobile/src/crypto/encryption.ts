import CryptoJS from "crypto-js";
import { getEncryptionKey } from "./keyManager";

export function encryptPayload(data: any): string {
    const key = getEncryptionKey();
    return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
}

export function decryptPayload(encrypted: string): any {
    const key = getEncryptionKey();
    const bytes = CryptoJS.AES.decrypt(encrypted, key);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}
