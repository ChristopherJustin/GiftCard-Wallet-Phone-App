alter table folders enable row level security;
alter table gift_cards enable row level security;

create policy "Users manage own folders"
on folders
for all
using (auth.uid() = user_id);

create policy "Users manage own gift cards"
on gift_cards
for all
using (auth.uid() = user_id);
