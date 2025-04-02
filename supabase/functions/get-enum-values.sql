
CREATE OR REPLACE FUNCTION get_enum_values(enum_name text)
RETURNS text[] AS $$
DECLARE
  enum_values text[];
BEGIN
  SELECT array_agg(enumlabel::text) INTO enum_values
  FROM pg_enum
  JOIN pg_type ON pg_enum.enumtypid = pg_type.oid
  WHERE pg_type.typname = enum_name;
  
  RETURN enum_values;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
