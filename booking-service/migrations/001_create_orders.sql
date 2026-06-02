-- migration: create_orders

CREATE TYPE order_status AS ENUM (
    'PENDING',
    'PAID',
    'CANCELED'
);

CREATE TABLE orders (
    id TEXT PRIMARY KEY,
    amount INTEGER NOT NULL DEFAULT 0,
    status order_status NOT NULL DEFAULT 'PENDING',
    qr_code TEXT,
    user_id TEXT NOT NULL,
    creaetd_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.udpated_at = NOW();

    RETURN NEW;
END;
$$ LANGUAGE plpgsq;

CREATE TRIGGEr trg_orders_updated_at
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE PROCEDURE update_timestamp();

