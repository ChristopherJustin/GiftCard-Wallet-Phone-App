import * as SecureStore from "expo-secure-store";

// A Supabase storage adapter using SecureStore
export const secureStoreAdapter = {
    getItem: async (key: string) => {
        try {
            const value = await SecureStore.getItemAsync(key);
            return value ?? null;
        } catch (e) {
            console.error("SecureStore getItem error:", e);
            return null;
        }
    },
    setItem: async (key: string, value: string) => {
        try {
            await SecureStore.setItemAsync(key, value);
        } catch (e) {
            console.error("SecureStore setItem error:", e);
        }
    },
    removeItem: async (key: string) => {
        try {
            await SecureStore.deleteItemAsync(key);
        } catch (e) {
            console.error("SecureStore removeItem error:", e);
        }
    },
};