import React from "react";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import { supabase } from "@/src/services/supabase";

WebBrowser.maybeCompleteAuthSession();

const redirectTo = "mobile://auth";

async function createSessionFromUrl(url: string) {
    const { params, errorCode } = QueryParams.getQueryParams(url);

    if (errorCode) {
        throw new Error(errorCode);
    }

    const access_token = params.access_token;
    const refresh_token = params.refresh_token;

    if (!access_token || !refresh_token) return;

    const { error } = await supabase.auth.setSession({
        access_token: String(access_token),
        refresh_token: String(refresh_token),
    });

    if (error) {
        throw error;
    }
}

export async function signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo,
            skipBrowserRedirect: true,
        },
    });

    if (error) throw error;

    const result = await WebBrowser.openAuthSessionAsync(
        data?.url ?? "",
        redirectTo
    );

    if (result.type === "success") {
        await createSessionFromUrl(result.url);
    }
}

export function useGoogleOAuthRedirectHandler() {
    const url = Linking.useLinkingURL();

    React.useEffect(() => {
        if (!url) return;

        createSessionFromUrl(url).catch((err) => {
            console.error("OAuth redirect error:", err);
        });
    }, [url]);
}