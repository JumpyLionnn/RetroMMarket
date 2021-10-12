async function isInvitationCodeValid(token: string){
    const rows = (await client.query("SELECT * FROM invitationTokens WHERE token = $1", [token])).rows;
    return rows.length !== 0 && rows[0].used === false;
}