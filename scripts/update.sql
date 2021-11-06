ALTER TABLE users ADD COLUMN emailVerified BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN admin BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN banned BOOLEAN DEFAULT false;

ALTER TABLE buyOrders DROP CONSTRAINT sellOfferId;
ALTER TABLE buyOrders ADD FOREIGN KEY (sellOfferId) REFERENCES sellOffers (id) on delete cascade;

ALTER TABLE buyOrders DROP CONSTRAINT buyerId;
ALTER TABLE buyOrders ADD FOREIGN KEY (buyerId) REFERENCES users(id) on delete cascade;

ALTER TABLE sellOffers DROP CONSTRAINT sellerid;
ALTER TABLE sellOffers ADD FOREIGN KEY (sellerId) REFERENCES users(id) on delete cascade;