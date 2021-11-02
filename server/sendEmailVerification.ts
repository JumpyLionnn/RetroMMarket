async function sendEmailVerification(userId: number, host: string){
    const user = await getUserById(userId);
    if(user.emailverified){
        return;
    }

    const token = jwt.sign({
        id: user.id
    }, process.env.EMAIL_JWT_SECRET);

    const verificationLink = `http${process.env.NODE_ENV === "production"? "s" : ""}://${host}/verify/email?${querystring.encode({token: token})}`;

    await sendEmail(user.email, "Verify Email Address", "", `
    <p>
    Hello ${user.retrommousername},<br/>
    <br/>
    You registered an account on RetroMMarket,<br/>
    before being able to use your account you need to verify that<br/>
    this is your email address by clicking here: <a href="${verificationLink}" target="_blank">${verificationLink}</a><br/>
    <br/>
    Kind Regards, RetroMMarket
    </p>
    `);
}
