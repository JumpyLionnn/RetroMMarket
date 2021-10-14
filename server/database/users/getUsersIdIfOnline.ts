async function getUsersIdIfOnline(){
    const onlinePlayers = await getAllOnlinePlayers();
    return (await client.query(`SELECT id FROM users WHERE retrommousername IN (${"'" + onlinePlayers.join("','").toLowerCase() + "'"});`)).rows;
}   