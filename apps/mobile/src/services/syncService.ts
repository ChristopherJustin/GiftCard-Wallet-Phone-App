import { db } from "@/src/db/database";
import { supabase } from "@/src/services/supabase";
import { getSyncQueue, removeSyncQueueItem } from "./syncQueueService";
import { getSyncState, setSyncState } from "./syncStateService";

//  Push local SQLite changes to Supabase
export async function pushLocalChanges() {
    const queue = getSyncQueue();

    for (const item of queue) {
        try {
            if (item.table_name === "gift_cards") {
                if (item.operation === "delete") {
                    const { error } = await supabase
                        .from("gift_cards")
                        .delete()
                        .eq("id", item.record_id);

                    if (!error) removeSyncQueueItem(item.id);
                    continue;
                }

                const card = db.getFirstSync<any>(
                    `SELECT * FROM gift_cards WHERE id = ?`,
                    [item.record_id]
                );

                if (!card) {
                    removeSyncQueueItem(item.id);
                    continue;
                }

                const { error } = await supabase
                    .from("gift_cards")
                    .upsert(card);

                if (!error) removeSyncQueueItem(item.id);
            }

            if (item.table_name === "folders") {
                if (item.operation === "delete") {
                    const { error } = await supabase
                        .from("folders")
                        .delete()
                        .eq("id", item.record_id);

                    if (!error) removeSyncQueueItem(item.id);
                    continue;
                }

                const folder = db.getFirstSync<any>(
                    `SELECT * FROM folders WHERE id = ?`,
                    [item.record_id]
                );

                if (!folder) {
                    removeSyncQueueItem(item.id);
                    continue;
                }

                const { error } = await supabase
                    .from("folders")
                    .upsert(folder);

                if (!error) removeSyncQueueItem(item.id);
            }
        } catch (err) {
            console.error("pushLocalChanges error:", err);
        }
    }
}

// Pull remote Supabase changes into SQLite
// Conflict rule: newest updated_at / last_modified wins
export async function pullRemoteChanges() {
    const lastPulledAt =
        getSyncState("last_pulled_at") ?? "1970-01-01T00:00:00.000Z";

    try {
        // Pull folders
        const { data: remoteFolders, error: foldersError } = await supabase
            .from("folders")
            .select("*")
            .gt("updated_at", lastPulledAt);

        if (foldersError) {
            console.error("pull folders error:", foldersError);
        }

        for (const folder of remoteFolders ?? []) {
            const local = db.getFirstSync<any>(
                `SELECT * FROM folders WHERE id = ?`,
                [folder.id]
            );

            if (!local) {
                db.runSync(
                    `INSERT INTO folders (id, name, created_at, updated_at)
                     VALUES (?, ?, ?, ?)`,
                    [folder.id, folder.name, folder.created_at, folder.updated_at]
                );
            } else {
                const remoteTime = new Date(folder.updated_at).getTime();
                const localTime = new Date(local.updated_at).getTime();

                if (remoteTime > localTime) {
                    db.runSync(
                        `UPDATE folders
                         SET name = ?, created_at = ?, updated_at = ?
                         WHERE id = ?`,
                        [folder.name, folder.created_at, folder.updated_at, folder.id]
                    );
                }
            }
        }

        // Pull gift cards
        const { data: remoteCards, error: cardsError } = await supabase
            .from("gift_cards")
            .select("*")
            .gt("last_modified", lastPulledAt);

        if (cardsError) {
            console.error("pull gift cards error:", cardsError);
        }

        for (const card of remoteCards ?? []) {
            const local = db.getFirstSync<any>(
                `SELECT * FROM gift_cards WHERE id = ?`,
                [card.id]
            );

            if (!local) {
                db.runSync(
                    `INSERT INTO gift_cards (
                        id, folder_id, label, encrypted_data, barcode_format,
                        initial_amount, remaining_amount,
                        created_at, updated_at, last_modified
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        card.id,
                        card.folder_id,
                        card.label,
                        card.encrypted_data,
                        card.barcode_format,
                        card.initial_amount,
                        card.remaining_amount,
                        card.created_at,
                        card.updated_at,
                        card.last_modified,
                    ]
                );
            } else {
                const remoteTime = new Date(card.last_modified).getTime();
                const localTime = new Date(local.last_modified).getTime();

                if (remoteTime > localTime) {
                    db.runSync(
                        `UPDATE gift_cards
                         SET folder_id = ?, encrypted_data = ?, barcode_format = ?,
                             initial_amount = ?, remaining_amount = ?,
                             created_at = ?, updated_at = ?, last_modified = ?
                         WHERE id = ?`,
                        [
                            card.folder_id,
                            card.encrypted_data,
                            card.barcode_format,
                            card.initial_amount,
                            card.remaining_amount,
                            card.created_at,
                            card.updated_at,
                            card.last_modified,
                            card.id,
                        ]
                    );
                }
            }
        }

        setSyncState("last_pulled_at", new Date().toISOString());
    } catch (err) {
        console.error("pullRemoteChanges error:", err);
    }
}

// Full sync cycle
export async function runSyncCycle() {
    await pushLocalChanges();
    await pullRemoteChanges();
}