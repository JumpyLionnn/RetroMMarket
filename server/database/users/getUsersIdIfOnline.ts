async function getUsersIdIfOnline(){
    const onlinePlayers = await getAllOnlinePlayers();
    if(onlinePlayers.length === 0){
        return [];
    }
    return (await client.query(`SELECT id FROM users WHERE retrommousername IN (${"'" + onlinePlayers.join("','").toLowerCase() + "'"});`)).rows;
}   