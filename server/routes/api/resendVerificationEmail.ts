async function resendVerificationEmail(req: ExpressRequest, res: ExpressResponse){
    const email = req.query.email;

    const user = await getUserByEmail(email);

    if(user !== null){
        if(!user.emailverified){
            await sendEmailVerification(user.id, req.header("host"));
        }
    }
    return res.send("the email has been sent.");
}