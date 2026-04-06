import { db } from "@/src/db/database";
import { randomUUID } from "expo-crypto";

export function enqueueSync(
    tableName: string,
    recordId: string,
    operation: "insert" | "update" | "delete"
) {
    db.runSync(
        `INSERT INTO sync_queue (id, table_name, record_id, operation, created_at)
         VALUES (?, ?, ?, ?, datetime('now'))`,
        [randomUUID(), tableName, recordId, operation]
    );
}

export function getSyncQueue() {
    return db.getAllSync<{
        id: string;
        table_name: string;
        record_id: string;
        operation: string;
        created_at: string;
    }>(
        `SELECT * FROM sync_queue ORDER BY created_at ASC`
    ) ?? [];
}

export function removeSyncQueueItem(id: string) {
    db.runSync(`DELETE FROM sync_queue WHERE id = ?`, [id]);
}