async function invitationCodeUsed(token: string, userId: number){
    client.query("UPDATE invitationTokens SET userId = $1, used = true WHERE token = $2;",
    [userId, token],
    (error: Error, response: any)=>{
        if(error){
            console.log(error);
        }
    });
}