async function resetPasswordPageRoute(req: ExpressRequest, res: ExpressResponse, variables: any){
    const token = req.query.token;
    try{
        const user = jwt.verify(token, process.env.FORGOT_PASSWORD_JWT_TOKEN);
        // make sure the token has not expired(expire time: 24 hours)
        if(Math.floor(Date.now() / 1000) - user.iat > 60 * 60 * 24){ 
            throw new Error();
        }
        const activeResetPasswordTokenRows = (await client.query("SELECT * FROM activeResetPasswordTokens WHERE token = $1;", [token])).rows;
        if(activeResetPasswordTokenRows[0] === undefined){
            throw new Error();
        }
    }
    catch(error){
        return res.redirect("/login");
    }
    res.render("resetPassword.html", variables);
}