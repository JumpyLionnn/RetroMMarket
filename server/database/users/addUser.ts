function addUserToDatabase(RetroMMOUsername: string, discordName: string, email: string, hashedPassword: string){
    client.query("INSERT INTO users(retrommousername, discordName, email, password, date) VALUES($1, $2, $3, $4, $5)",
    [RetroMMOUsername, discordName, email, hashedPassword, Date.now()],
    (error: Error, response: any)=>{
        if(error){
            console.log(error);
        }
        else{
            console.log(response);
        }
    });
}