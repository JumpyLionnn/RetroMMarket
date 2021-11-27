async function disableNotifications(req: ExpressRequest, res: ExpressResponse){
    await client.query(
        "UPDATE users SET notifications = false WHERE id = $1", 
        [req.user.id]
    );
    res.send("success");
}