async function loginRoute(req: ExpressRequest, res: ExpressResponse){
    //validating names email and password
    const email = req.body.email;
    if(typeof email !== "string"){
        return loginPageRoute(req, res, {errorMessage: "email is not valid."});
    }
    else{
        if(!emailVerification.test(email) || email.length > 255){
            return loginPageRoute(req, res, {errorMessage: "email is not valid."});
        }
    }

    const password = req.body.password;
    if(typeof password !== "string"){
        return loginPageRoute(req, res, {errorMessage: "password is not valid."});
    }

    // getting the user from the database
    const user = await getUserByEmail(email);
    if(user === null){
        return loginPageRoute(req, res, {errorMessage: "email or password is wrong."});
    }

    if(user.banned){
        return loginPageRoute(req, res, {errorMessage: "you are banned from RetroMMarket. To get unbanned please contact jumpylionnn#9976 or cornerlord#7181"});
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if(!validPassword){
        return loginPageRoute(req, res, {errorMessage: "email or password is wrong."});
    }

    if(!user.emailverified){
        return loginPageRoute(req, res, {alert: true, alertTitle: "Verify email adress", 
        alertMessage: `your email is not verified. click <a id="resend-verification-email-link" href="/resendVerificationEmail?email=${user.email}">here</a> to resend you a verification email`,
        alertOk: true
    });
    }

    const token = jwt.sign({
        id: user.id
    }, process.env.JWT_SECRET);
    res.cookie("auth-token", token);
    res.redirect("/");
    
}