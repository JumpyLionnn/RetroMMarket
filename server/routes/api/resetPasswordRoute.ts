async function resetPasswordRoute(req: ExpressRequest, res: ExpressResponse){
    const token = req.body.token;
    let user;
    try{
        user = jwt.verify(token, process.env.FORGOT_PASSWORD_JWT_TOKEN);
        // make sure the token has not expired(expire time: 24 hours)
        if(Math.floor(Date.now() / 1000) - user.iat > 60 * 60 * 24){ 
            throw new Error();
        }
        const activeResetPasswordTokenRows = (await client.query("SELECT * FROM activeResetPasswordTokens WHERE token = $1;", [token])).rows;
        if(activeResetPasswordTokenRows[0] === undefined){
            throw new Error();
        }
        else{
            await client.query("DELETE FROM activeResetPasswordTokens WHERE token = $1", [token]);
        }
    }
    catch(error){
        return res.redirect("/login");
    }
    const password = req.body.password;
    req.query.token = req.body.token;
    if(typeof password !== "string"){
        return res.redirect(`/resetpassword?token=${token}`);
    }
    else{
        if(password.length < 5){
            return res.redirect(`/resetpassword?token=${token}`);
        }
        else if(password.length > 40){
            return res.redirect(`/resetpassword?token=${token}`);
        }
    }

    let hashedPassword: string;
    try{
    hashedPassword = await bcrypt.hash(password, 10);
    }
    catch(error){
        return resetPasswordPageRoute(req, res, {errorMessage: "password changing failed."});
    }
    await client.query("UPDATE users SET password = $1 WHERE id = $2", [hashedPassword, user.id]);
    res.redirect("/login");
}