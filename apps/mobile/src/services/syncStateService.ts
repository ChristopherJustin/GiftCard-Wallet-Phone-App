import { db } from "@/src/db/database";

export function getSyncState(key: string): string | null {
    const row = db.getFirstSync<{ value: string }>(
        `SELECT value FROM sync_state WHERE key = ?`,
        [key]
    );
    return row?.value ?? null;
}

export function setSyncState(key: string, value: string) {
    db.runSync(
        `INSERT OR REPLACE INTO sync_state (key, value) VALUES (?, ?)`,
        [key, value]
    );
}