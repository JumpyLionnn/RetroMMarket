async function addUserToDatabase(RetroMMOUsername: string, discordName: string, email: string, hashedPassword: string){
    await client.query("INSERT INTO users(retrommousername, discordName, email, password, date) VALUES($1, $2, $3, $4, $5)",
    [RetroMMOUsername.toLowerCase(), discordName, email, hashedPassword, Date.now()],
    (error: Error, response: any)=>{
        if(error){
            console.log(error);
        }
    });
}