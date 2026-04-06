import { useEffect } from "react";
import NetInfo from "@react-native-community/netinfo";
import { runSyncCycle } from "@/src/services/syncService";

export function useNetworkSync() {

    useEffect(() => {

        const unsubscribe = NetInfo.addEventListener(state => {

            if (state.isConnected && state.isInternetReachable) {
                console.log("🌐 Network reconnected → running sync");
                runSyncCycle();
            }

        });

        return () => unsubscribe();

    }, []);

}