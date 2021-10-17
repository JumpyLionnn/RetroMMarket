async function changeDiscordName(newDiscordName: string, id: number){
    await client.query("UPDATE users SET discordname = $1 WHERE id = $2", [newDiscordName, id]);
}