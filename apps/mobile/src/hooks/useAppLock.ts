import { useEffect } from "react";
import { AppState } from "react-native";
import { lockEncryptionKey } from "@/src/crypto/keyManager";

export function useAppLock() {
    useEffect(() => {
        const sub = AppState.addEventListener("change", state => {
            if (state !== "active") {
                lockEncryptionKey(); // wipe key
            }
        });

        return () => sub.remove();
    }, []);
}