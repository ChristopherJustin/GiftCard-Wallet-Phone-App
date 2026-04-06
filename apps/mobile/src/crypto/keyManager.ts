let unlockedKey: string | null = null;

//  Store encryption key in memory AFTER biometric success
export function unlockEncryptionKey(key: string) {
    unlockedKey = key;
}

// Retrieve key (throws if locked)
export function getEncryptionKey(): string {
    if (!unlockedKey) {
        throw new Error("Encryption key is locked");
    }
    return unlockedKey;
}


// Wipe key from memory (on app background)
export function lockEncryptionKey() {
    unlockedKey = null;
}