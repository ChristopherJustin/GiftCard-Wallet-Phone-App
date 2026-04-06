import React from "react";
import { Stack } from "expo-router";
import { useAuth } from "@/src/providers/AuthProvider";
import { useSync } from "@/src/hooks/useSync";
import { useNetworkSync } from "@/src/hooks/useNetworkSync";

export default function AppLayout() {
    useSync();
    useNetworkSync();

    const { isAuthenticated, loading } = useAuth();

    // wait until auth state is restored
    if (loading) {
        return null;
    }

    // not logged in → redirect to auth routes
    if (!isAuthenticated) {
        return <Stack screenOptions={{ headerShown: false }} />;
    }

    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}
        />
    );
}







