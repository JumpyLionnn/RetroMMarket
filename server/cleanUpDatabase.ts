async function cleanUpDatabase(){
    await client.query("DELETE FROM activeResetPasswordTokens WHERE date < $1", [Date.now() - (1000 * 60 * 60 * 24)]);
}