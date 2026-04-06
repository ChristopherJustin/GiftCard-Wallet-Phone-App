import * as SecureStore from "expo-secure-store";

const BIOMETRIC_PREF_KEY = "biometric_enabled";

export async function isBiometricEnabled(): Promise<boolean> {
    const value = await SecureStore.getItemAsync(BIOMETRIC_PREF_KEY);
    return value === "true";
}