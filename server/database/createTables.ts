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
    `);
}