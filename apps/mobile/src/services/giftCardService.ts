import { db } from "../db/database";
import { randomUUID } from "expo-crypto";
import { GiftCard } from "../types/GiftCard";
import { enqueueSync } from "./syncQueueService";

// Create a new gift card with amounts
export function createGiftCard(
    folderId: string,
    label: string,
    encryptedData: string,
    barcodeFormat: string,
    initialAmount: number,
    remainingAmount: number
): string {

    const id = randomUUID();

    db.runSync(
        `INSERT INTO gift_cards (
          id, folder_id, label,
          encrypted_data, barcode_format,
          initial_amount, remaining_amount,
          created_at, updated_at, last_modified
        ) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'), datetime('now'))`,
        [id, folderId, label, encryptedData, barcodeFormat, initialAmount, remainingAmount]
    );

    // record sync
    const syncId = randomUUID();

    db.runSync(
        `INSERT INTO sync_queue (id, table_name, record_id, operation, created_at)
         VALUES (?, ?, ?, ?, datetime('now'))`,
        [syncId, "gift_cards", id, "insert"]
    );

    enqueueSync("gift_cards", id, "insert");

    return id;
}

// Read all cards for a folder

export function getGiftCardsByFolder(folderId: string): GiftCard[] {
    return db.getAllSync<GiftCard>(
        `SELECT * FROM gift_cards
        WHERE folder_id = ?
        AND deleted_at IS NULL`,
        [folderId]
    ) ?? [];
}

// Get one card by ID

export function getGiftCardById(id: string): GiftCard | null {
    return db.getFirstSync<GiftCard>(
        `SELECT * FROM gift_cards WHERE id = ?`,
        [id]
    ) ?? null;
}

// Delete a gift card

export function deleteGiftCard(id: string) {

    db.runSync(
        `UPDATE gift_cards
         SET deleted_at = datetime('now'),
             updated_at = datetime('now'),
             last_modified = datetime('now')
         WHERE id = ?`,
        [id]
    );

    enqueueSync("gift_cards", id, "delete");
}

// Update card balance based on spend

export function spendOnGiftCard(cardId: string, amountSpent: number) {
    const card = getGiftCardById(cardId);
    if (!card) return 0;

    const newRemaining = card.remaining_amount - amountSpent;

    db.runSync(
        `UPDATE gift_cards
     SET remaining_amount = ?, updated_at = datetime('now'), last_modified = datetime('now')
     WHERE id = ?`,
        [newRemaining, cardId]
    );
    enqueueSync("gift_cards", cardId, "update");

    // record history
    const historyId = randomUUID();
    db.runSync(
        `INSERT INTO spend_history (id, card_id, amount_spent, created_at)
         VALUES (?, ?, ?, datetime('now'))`,
        [historyId, cardId, amountSpent]
    );

    return newRemaining;
}

export function getSpendHistory(cardId: string) {
    return db.getAllSync(
        `SELECT * FROM spend_history WHERE card_id = ?
         ORDER BY created_at DESC`,
        [cardId]
    ) ?? [];
}