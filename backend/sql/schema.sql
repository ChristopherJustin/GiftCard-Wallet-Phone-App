create table folders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  name text not null,
  created_at timestamptz default now()
);

create table gift_cards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  folder_id uuid references folders,
  store_name text not null,
  encrypted_payload text not null,
  barcode_format text not null,
  last_modified timestamptz default now()
  remaining_amount REAL NOT NULL DEFAULT 0,
  initial_amount REAL NOT NULL DEFAULT 0
);
