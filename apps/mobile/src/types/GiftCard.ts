export type GiftCard = {
    id: string;
    folder_id: string;
    label: string;
    encrypted_data: string;
    barcode_format: string;
    initial_amount: number;
    remaining_amount: number;
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;

    // UI-only (not stored in DB)
    display_label?: string;
};