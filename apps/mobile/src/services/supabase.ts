import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";
import { CONFIG } from "@/src/config";
import { secureStoreAdapter } from "./secureStoreAdapter";

export const supabase = createClient(
    CONFIG.supabaseUrl,
    CONFIG.supabaseAnonKey,
    {
        auth: {
            storage: secureStoreAdapter,
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: false,
        },
    }
);