async function update(){
    await client.query("DELETE FROM activeResetPasswordTokens WHERE date < $1", [Date.now() - (1000 * 60 * 60 * 24)]);

    requests = 0;
}