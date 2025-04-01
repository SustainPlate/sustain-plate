
-- Execute this SQL in your Supabase SQL editor:
-- This function safely updates donation status and reserved_by fields
create or replace function update_donation_status(
  donation_id uuid,
  new_status text,
  user_id uuid
) returns void as $$
begin
  update donations
  set 
    status = new_status,
    reserved_by = user_id,
    reserved_at = now()
  where id = donation_id
  and status = 'available';
end;
$$ language plpgsql;
