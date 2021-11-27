async function update(){
    const time = Date.now();
    await client.query("DELETE FROM activeResetPasswordTokens WHERE date < $1", [time - (1000 * 60 * 60 * 24)]);

    // notifications expire after 2 weeks and seen notifications expire after 1 hour
    await client.query("DELETE FROM notifications WHERE date < $1 OR (seenDate < $2 AND seen = true)", [time - (1000 * 60 * 60 * 24 * 14), time - (1000 * 60 * 60)]);
    requests = 0;
}