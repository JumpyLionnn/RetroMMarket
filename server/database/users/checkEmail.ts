async function checkUserEmail(email: string): Promise<boolean> {
    return (await client.query("SELECT * FROM users WHERE email = $1", [email])).rows.length !== 0;
}