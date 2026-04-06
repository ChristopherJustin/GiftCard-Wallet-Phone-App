import { useEffect } from "react";
import { runSyncCycle } from "@/src/services/syncService";

export function useSync() {
    useEffect(() => {
        let active = true;

        const sync = async () => {
            if (!active) return;
            await runSyncCycle();
        };

        sync();

        const interval = setInterval(sync, 15000);

        return () => {
            active = false;
            clearInterval(interval);
        };
    }, []);
}