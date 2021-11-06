ALTER TABLE users ADD COLUMN emailVerified BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN admin BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN banned BOOLEAN DEFAULT false;

ALTER TABLE buyOrders DROP CONSTRAINT buyorders_sellofferid_fkey;
ALTER TABLE buyOrders ADD FOREIGN KEY (sellOfferId) REFERENCES sellOffers (id) on delete cascade;

ALTER TABLE buyOrders DROP CONSTRAINT buyorders_buyerid_fkey;
ALTER TABLE buyOrders ADD FOREIGN KEY (buyerId) REFERENCES users(id) on delete cascade;

ALTER TABLE sellOffers DROP CONSTRAINT selloffers_sellerid_fkey;
ALTER TABLE sellOffers ADD FOREIGN KEY (sellerId) REFERENCES users(id) on delete cascade;

DELETE FROM sellOffers WHERE canceled = true;
DELETE FROM buyOrders WHERE canceled = true;

ALTER TABLE sellOffers DROP COLUMN canceled;
ALTER TABLE buyOrders DROP COLUMN canceled;

UPDATE users SET emailVerified = true;