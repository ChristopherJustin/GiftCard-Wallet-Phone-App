import * as SQLite from "expo-sqlite";

export const db = SQLite.openDatabaseSync("giftcard.db");

export function initDatabase() {
    // Create tables if they don't exist
    db.execSync(`
      CREATE TABLE IF NOT EXISTS folders (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS gift_cards (
        id TEXT PRIMARY KEY NOT NULL,
        folder_id TEXT NOT NULL,
        encrypted_data TEXT NOT NULL,
        barcode_format TEXT NOT NULL,
        initial_amount REAL NOT NULL DEFAULT 0,
        remaining_amount REAL NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        last_modified TEXT NOT NULL,
        FOREIGN KEY (folder_id) REFERENCES folders(id)
      );

      CREATE TABLE IF NOT EXISTS spend_history (
        id TEXT PRIMARY KEY NOT NULL,
        card_id TEXT NOT NULL,
        amount_spent REAL NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (card_id) REFERENCES gift_cards(id)
      );

      CREATE TABLE IF NOT EXISTS sync_queue (
        id TEXT PRIMARY KEY,
        table_name TEXT,
        record_id TEXT,
        operation TEXT,
        created_at TEXT
      );

      CREATE TABLE IF NOT EXISTS sync_queue (
        id TEXT PRIMARY KEY NOT NULL,
        table_name TEXT NOT NULL,
        record_id TEXT NOT NULL,
        operation TEXT NOT NULL,
        created_at TEXT NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS sync_state (
        key TEXT PRIMARY KEY NOT NULL,
        value TEXT
      );
    `);

    // Attempt to add columns if missing
    try {
        db.execSync(`ALTER TABLE gift_cards ADD COLUMN initial_amount REAL DEFAULT 0;`);
    } catch { }
    try {
        db.execSync(`ALTER TABLE gift_cards ADD COLUMN remaining_amount REAL DEFAULT 0;`);
    } catch { }
    try {
        db.execSync(`ALTER TABLE gift_cards ADD COLUMN label TEXT;`);
    } catch { }
    try {
        db.execSync(`ALTER TABLE gift_cards ADD COLUMN deleted_at TEXT;`);
    } catch {}
}

initDatabase();

