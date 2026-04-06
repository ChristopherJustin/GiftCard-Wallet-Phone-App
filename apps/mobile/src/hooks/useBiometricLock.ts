import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";
import { setLastUnlockTime } from "@/src/crypto/lockState";
import { isBiometricEnabled } from "@/src/crypto/biometricSettings";

const BIOMETRIC_KEY = "biometric_enabled";

export function useBiometricLock() {
    const [enabled, setEnabled] = useState<boolean>(false);
    const [supported, setSupported] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);

    // Check device support + stored preference
    useEffect(() => {
        (async () => {
            const hardware = await LocalAuthentication.hasHardwareAsync();
            const enrolled = await LocalAuthentication.isEnrolledAsync();

            setSupported(hardware && enrolled);

            const stored = await SecureStore.getItemAsync(BIOMETRIC_KEY);
            setEnabled(stored === "true");
            setLoading(false);
        })();
    }, []);

    // Toggle biometrics
    async function setBiometricEnabled(value: boolean) {
        if (!supported) return;

        if (value) {
            // Require auth before enabling
            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: "Enable biometric protection",
                cancelLabel: "Cancel",
            });

            if (!result.success) return;
        }

        await SecureStore.setItemAsync(
            BIOMETRIC_KEY,
            value ? "true" : "false"
        );
        setEnabled(value);
    }

    // Require biometric auth (used on resume / gift card)
    async function requireBiometricAuth(): Promise<boolean> {

        const enabled = await isBiometricEnabled();
        if (!enabled) return true;

        const supported =
            await LocalAuthentication.hasHardwareAsync() &&
            await LocalAuthentication.isEnrolledAsync();

        if (!supported) return true;

        const result = await LocalAuthentication.authenticateAsync({
            promptMessage: "Unlock Gift Cards",
        });

        if (result.success) {
            await setLastUnlockTime();
        }

        return result.success;
    }


    return {
        supported,
        enabled,
        loading,
        setBiometricEnabled,
        requireBiometricAuth,
    };
}