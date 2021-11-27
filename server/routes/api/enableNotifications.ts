async function enableNotifications(req: ExpressRequest, res: ExpressResponse){
    let endpoint = req.body.endpoint;
    if(typeof endpoint !== 'string'){
        return res.status(400).send("the endpoint is not valid.");
    }

    let p256dh = req.body.keys.p256dh;
    if(typeof p256dh !== 'string'){
        return res.status(400).send("the p256dh is not valid.");
    }

    let auth = req.body.keys.auth;
    if(typeof auth !== 'string'){
        return res.status(400).send("the auth is not valid.");
    }

    await client.query(
        "UPDATE users SET notifications = true, notificationsEndpoint = $1, notificationsP256dh = $2, notificationsAuth = $3 WHERE id = $4", 
        [endpoint, p256dh, auth, req.user.id]
    );
    res.send("success");
}