async function verifyEmail(req: ExpressRequest, res: ExpressResponse){
    const token = req.query.token;
    try{
        const user = jwt.verify(token, process.env.EMAIL_JWT_SECRET);
        // make sure the token has not expired(expire time: 1 hour)
        if(Math.floor(Date.now() / 1000) - user.iat > 60 * 60 * 1){ 
            console.log("time expired");
            throw new Error();
        }
        await client.query("UPDATE users SET emailVerified = true WHERE id = $1", [user.id]);
        return res.redirect("/login");
    }
    catch(error){
        return res.send("token is not valid");
    }
}