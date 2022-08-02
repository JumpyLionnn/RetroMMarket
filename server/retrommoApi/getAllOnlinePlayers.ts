async function getAllOnlinePlayers(){
    return await (await request("https://play.retro-mmo.com/players.json")).json();
}