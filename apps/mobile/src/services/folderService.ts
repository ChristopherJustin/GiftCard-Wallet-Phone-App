import "../db/database"; // ensures tables exist
import { db } from "../db/database";
import { randomUUID } from "expo-crypto";
import { enqueueSync } from "./syncQueueService";

export type FolderRecord = {
    id: string;
    name: string;
    created_at: string;
    updated_at: string;
};

// Create a new folder
export function createFolder(name: string): FolderRecord {
    const now = new Date().toISOString();
    const id = randomUUID();

    db.runSync(
        `INSERT INTO folders (id, name, created_at, updated_at)
     VALUES (?, ?, ?, ?)`,
        [id, name, now, now]
    );

    // record sync operation
    enqueueSync("folders", id, "insert");

    return {
        id,
        name,
        created_at: now,
        updated_at: now,
    };
}

// Get all folders ordered by most recently updated
export function getAllFolders(): FolderRecord[] {
    const result = db.getAllSync<FolderRecord>(
        `SELECT * FROM folders
     ORDER BY updated_at DESC`
    );

    return result ?? [];
}

// Get a single folder by id
export function getFolderById(id: string): FolderRecord | null {
    const result = db.getFirstSync<FolderRecord>(
        `SELECT * FROM folders WHERE id = ?`,
        [id]
    );

    return result ?? null;
}

// Rename a folder
export function updateFolderName(id: string, name: string) {
    const now = new Date().toISOString();

    db.runSync(
        `UPDATE folders
     SET name = ?, updated_at = ?
     WHERE id = ?`,
        [name, now, id]
    );

    // record sync operation
    enqueueSync("folders", id, "update");
}

// Delete a folder
export function deleteFolder(id: string) {
    db.runSync(`DELETE FROM folders WHERE id = ?`, [id]);

    // record sync operation
    enqueueSync("folders", id, "delete");
}
