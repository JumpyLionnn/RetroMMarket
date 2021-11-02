async function forgotPasswordRoute(req: ExpressRequest, res: ExpressResponse){
    const email = req.body.email;
    if(typeof email !== "string"){
        return res.status(400).send("the email is invalid");
    }
    const user = await getUserByEmail(email);

    if(user !== null){
        const token = jwt.sign({
            id: user.id
        }, process.env.FORGOT_PASSWORD_JWT_TOKEN);

        await client.query("INSERT INTO activeResetPasswordTokens(token, date) VALUES ($1, $2)", [token, Date.now()]);

        const forgotPasswordLink = `http${process.env.NODE_ENV === "production"? "s" : ""}://${req.header("host")}/resetpassword?${querystring.encode({token: token})}`;

        await sendEmail(user.email, "Forgot Password", "", `
        <p>
        Hi ${user.retrommousername},<br/>
        <br/>
        There was a request to change your password!<br/>
        If you did not make this request then please ignore this email.<br/>
        Otherwise, please click this link to change your password: <a href="${forgotPasswordLink}" target="_blank">${forgotPasswordLink}</a><br/>
        <br/>
        Kind Regards, RetroMMarket
        </p>
        `);
    }
    return res.redirect("/login");
}