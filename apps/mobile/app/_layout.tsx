import React from "react";
import { Stack } from "expo-router";
import AuthProvider from "@/src/providers/AuthProvider";
import { useAppLock } from "@/src/hooks/useAppLock";
import { useAppResumeBiometric } from "@/src/hooks/useAppResumeBiometric";
import { useGoogleOAuthRedirectHandler } from "@/src/services/googleOAuth";

export default function RootLayout() {
    useGoogleOAuthRedirectHandler();
    useAppLock();
    useAppResumeBiometric();

    return (
        <AuthProvider>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(auth)" />
                <Stack.Screen name="(app)" />
            </Stack>
        </AuthProvider>
    );
}

