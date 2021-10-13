async function getUserById(id: number){
    let rows = (await client.query("SELECT * FROM users WHERE id = $1", [id])).rows;
    return rows.length === 0 ? null : rows[0];
}