async function deleteUserRoute(req: ExpressRequest, res: ExpressResponse){
    const name = req.body.name;
    if(name === undefined){
        res.status(400).send("the name is not valid");
    }
    const user = (await client.query("SELECT * FROM users WHERE retrommousername = $1;", [name])).rows[0];
    if(user === undefined) {
        res.status(400).send("the user does not exist");
    }

    await client.query(`DELETE FROM users WHERE id = $1;`, [user.id]);
    res.send("success");
}