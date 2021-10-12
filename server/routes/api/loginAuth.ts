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

    const validPassword = await bcrypt.compare(password, user.password);
    if(!validPassword){
        return loginPageRoute(req, res, {errorMessage: "email or password is wrong."});
    }

    const token = jwt.sign({id: user.id}, process.env.JWT_SECRET);
    res.cookie("auth-token", token);
    res.redirect("/");
    
}