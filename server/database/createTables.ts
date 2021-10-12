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
            date bigint
        );

        /* account creation invites
        *******************************/
        CREATE TABLE IF NOT EXISTS invitationTokens(
            token VARCHAR(6) UNIQUE NOT NULL,
            used BOOLEAN DEFAULT false,
            userId INTEGER REFERENCES users(id)
        );
    `);
}