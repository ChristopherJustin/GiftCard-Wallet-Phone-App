import { useEffect } from "react";
import { AppState } from "react-native";
import { useRouter } from "expo-router";
import { getLastUnlockTime } from "@/src/crypto/lockState";
import { AUTO_LOCK_TIMEOUT_MS } from "@/src/constants/security";
import { useBiometricLock } from "./useBiometricLock";
import { isBiometricEnabled } from "@/src/crypto/biometricSettings";

export function useAppResumeBiometric() {
    const router = useRouter();
    const { requireBiometricAuth } = useBiometricLock();

    useEffect(() => {

        let currentState = AppState.currentState;

        const sub = AppState.addEventListener("change", async (nextState) => {

            if (
                currentState.match(/inactive|background/) &&
                nextState === "active"
            ) {

                const enabled = await isBiometricEnabled();
                if (!enabled) return;

                const lastUnlock = await getLastUnlockTime();

                const expired =
                    !lastUnlock ||
                    Date.now() - lastUnlock > AUTO_LOCK_TIMEOUT_MS;

                if (expired) {

                    const ok = await requireBiometricAuth();

                    if (!ok) {
                        router.replace("/"); // safe fallback
                    }

                }
            }

            currentState = nextState;
        });

        return () => sub.remove();

    }, []);
}