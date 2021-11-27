async function getNotificationsRoute(req: ExpressRequest, res: ExpressResponse){
    res.send((await client.query("SELECT * FROM notifications WHERE userId = $1;", [req.user.id])).rows);
    client.query("UPDATE notifications SET seen = true, seenDate = $2 WHERE userId = $1;", [req.user.id, Date.now()]);
}       