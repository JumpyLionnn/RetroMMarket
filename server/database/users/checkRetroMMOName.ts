async function checkUserRetroMMOUsername(name: string){
    return (await client.query("SELECT * FROM users WHERE retrommousername = $1", [name])).rows.length !== 0;
}