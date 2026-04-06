import * as SecureStore from "expo-secure-store";
import * as Crypto from "expo-crypto";
import nacl from "tweetnacl";
import * as naclUtil from "tweetnacl-util";

const KEY_NAME = "giftcard_wallet_secretbox_key_v1";

// Key management (32 bytes)
async function getOrCreateKey(): Promise<Uint8Array> {
    const existing = await SecureStore.getItemAsync(KEY_NAME);
    if (existing) {
        return naclUtil.decodeBase64(existing);
    }

    const key = await Crypto.getRandomBytesAsync(32);
    await SecureStore.setItemAsync(KEY_NAME, naclUtil.encodeBase64(key));
    return key;
}

// Encrypt JSON payload -> string
export async function encryptGiftCardPayload(payload: unknown): Promise<string> {
    const key = await getOrCreateKey();
    const nonce = await Crypto.getRandomBytesAsync(nacl.secretbox.nonceLength); // 24 bytes

    const plaintext = naclUtil.decodeUTF8(JSON.stringify(payload));
    const boxed = nacl.secretbox(plaintext, nonce, key);

    // Store as: "sb1:<nonceBase64>:<cipherBase64>"
    const out =
        "sb1:" +
        naclUtil.encodeBase64(nonce) +
        ":" +
        naclUtil.encodeBase64(boxed);

    return out;
}

// Decrypt string -> object (with safe fallback)
export async function decryptGiftCardPayload(
    encryptedData: string
): Promise<{ label?: string; number?: string; pin?: string }> {
    if (!encryptedData) return {};

    // NEW FORMAT: sb1:nonce:cipher
    if (encryptedData.startsWith("sb1:")) {
        const parts = encryptedData.split(":");
        if (parts.length !== 3) return {};

        const [, nonceB64, cipherB64] = parts;

        const key = await getOrCreateKey();
        const nonce = naclUtil.decodeBase64(nonceB64);
        const cipher = naclUtil.decodeBase64(cipherB64);

        const opened = nacl.secretbox.open(cipher, nonce, key);
        if (!opened) return {}; // wrong key / corrupted data

        const json = naclUtil.encodeUTF8(opened);
        try {
            return JSON.parse(json);
        } catch {
            return {};
        }
    }

    // OLD FORMAT FALLBACK: plaintext JSON stored in encrypted_data
    try {
        return JSON.parse(encryptedData);
    } catch {
        // fallback: treat the entire string as the card number
        return { label: "Gift Card", number: encryptedData };
    }
}