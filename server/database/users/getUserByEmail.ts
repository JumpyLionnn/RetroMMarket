async function getUserByEmail(email:string){
    let rows = (await client.query("SELECT * FROM users WHERE email = $1", [email])).rows;
    return rows.length === 0 ? null : rows[0];
}