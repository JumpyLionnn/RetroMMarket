async function checkUserRetroMMOUsername(name: string, userId: number){
    return (await client.query("SELECT * FROM users WHERE retrommousername = $1 AND id != $2", [name, userId])).rows.length !== 0;
}