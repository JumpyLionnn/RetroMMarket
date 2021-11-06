async function unbanRoute(req: ExpressRequest, res: ExpressResponse){
    const name = req.body.name;
    if(name === undefined){
        res.status(400).send("the name is not valid");
    }
    const user = (await client.query("SELECT * FROM users WHERE retrommousername = $1;", [name])).rows[0];
    if(user === null){
        res.status(400).send("the user does not exist");
    }
    if(!user.banned){
        res.status(400).send("this user is not banned");
    }
    await client.query("UPDATE users SET banned = false WHERE id = $1", [user.id]);
    res.send("success");
}