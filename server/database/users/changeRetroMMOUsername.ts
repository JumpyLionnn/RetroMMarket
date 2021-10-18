async function changeRetroMMOUsername(newRetroMMOUserName: string, id: number){
    await client.query("UPDATE users SET RetroMMOUsername = $1 WHERE id = $2", [newRetroMMOUserName, id]);
}