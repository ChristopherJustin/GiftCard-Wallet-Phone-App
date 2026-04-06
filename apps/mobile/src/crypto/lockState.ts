import * as SecureStore from "expo-secure-store";

const LAST_UNLOCK_KEY = "last_unlock_timestamp";

export async function setLastUnlockTime() {
    await SecureStore.setItemAsync(
        LAST_UNLOCK_KEY,
        Date.now().toString()
    );
}

export async function getLastUnlockTime(): Promise<number | null> {
    const value = await SecureStore.getItemAsync(LAST_UNLOCK_KEY);
    return value ? Number(value) : null;
}

export async function clearLastUnlockTime() {
    await SecureStore.deleteItemAsync(LAST_UNLOCK_KEY);
}