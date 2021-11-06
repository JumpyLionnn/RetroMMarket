function createTables(){
    client.query(`
        /* users
        **********/
        CREATE TABLE IF NOT EXISTS users(
            id SERIAL PRIMARY KEY,
            retrommousername VARCHAR(255) UNIQUE,
            discordName VARCHAR(255),
            email VARCHAR(255) UNIQUE,
            password VARCHAR(1024),
            emailVerified BOOLEAN DEFAULT false,
            admin BOOLEAN DEFAULT false,
            banned BOOLEAN DEFAULT false,
            date bigint
        );

        /* sell offers
        ******************/
        CREATE TABLE IF NOT EXISTS sellOffers(
            id SERIAL PRIMARY KEY,
            item VARCHAR(50) NOT NULL,
            category VARCHAR(50),
            price INTEGER,
            amount INTEGER,
            sellerId INTEGER REFERENCES users(id) ON DELETE CASCADE,
            date bigint,
            done BOOLEAN DEFAULT false,
            canceled BOOLEAN DEFAULT false
        );

        /* buyOrders
        **************/
        CREATE TABLE IF NOT EXISTS buyOrders(
            id SERIAL PRIMARY KEY,
            sellOfferId INTEGER REFERENCES sellOffers(id) ON DELETE CASCADE,
            buyerId INTEGER REFERENCES users(id) ON DELETE CASCADE,
            amount INTEGER,
            sellerDelivered BOOLEAN DEFAULT false,
            buyerDelivered BOOLEAN DEFAULT false,
            date bigint,
            done BOOLEAN DEFAULT false,
            canceled BOOLEAN DEFAULT false
        );

        /* active reset password invitationTokens
        ******************************************/
       CREATE TABLE IF NOT EXISTS activeResetPasswordTokens(
           token VARCHAR(1024),
           date bigint
       );
    `);
}