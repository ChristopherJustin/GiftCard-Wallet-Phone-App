import Constants from "expo-constants";

const extra = Constants.expoConfig?.extra ?? {};

export const CONFIG = {
    supabaseUrl: extra.supabaseUrl as string,
    supabaseAnonKey: extra.supabaseAnonKey as string,
};