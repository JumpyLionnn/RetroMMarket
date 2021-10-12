async function registerRoute(req: ExpressRequest, res: ExpressResponse){
    //validating names email and password
    const RetroMMOUsername = req.body.RetroMMOUsername;
    if(typeof RetroMMOUsername !== "string"){
        
        return registerPageRoute(req, res, {errorMessage: "RetroMMO name is not valid."});
        //return res.status(400).send("RetroMMO name is not valid.");
    }   
    else{
        if(RetroMMOUsername.length > 255){
            return registerPageRoute(req, res, {errorMessage: "RetroMMO name is not valid."});
            //return res.status(400).send("RetroMMO name is not valid.");
        }
    }

    const discordName = req.body.discordName;
    if(typeof discordName !== "string"){
        return registerPageRoute(req, res, {errorMessage: "discord name is not valid."});
    }
    else{
        if(!discordNameVerification.test(discordName) || discordName.length > 255){
            return registerPageRoute(req, res, {errorMessage: "discord name is not valid."});
        }
    }

    const email = req.body.email;
    if(typeof email !== "string"){
        return registerPageRoute(req, res, {errorMessage: "email is not valid."});
    }
    else{
        if(!emailVerification.test(email) || email.length > 255){
            return registerPageRoute(req, res, {errorMessage: "email is not valid."});
        }
    }



    const password = req.body.password;
    if(typeof password !== "string"){
        return registerPageRoute(req, res, {errorMessage: "password is not valid."});
    }
    else{
        if(password.length < 5){
            return registerPageRoute(req, res, {errorMessage: "password is too short."});
        }
        else if(password.length > 40){
            return registerPageRoute(req, res, {errorMessage: "password is too long."});
        }
    }

    // checking for duplicates
    if(await checkUserEmail(email)){
        return registerPageRoute(req, res, {errorMessage: "email already exists."});
    }
    if(await checkUserRetroMMOUsername(RetroMMOUsername)){
        return registerPageRoute(req, res, {errorMessage: "RetroMMO username already exists."});
    }

    // hshing the password
    let hashedPassword: string;
    try{
    hashedPassword = await bcrypt.hash(password, 10);
    }
    catch(error){
        return registerPageRoute(req, res, {errorMessage: "account creation faild."});
    }

    // adding to database
    addUserToDatabase(RetroMMOUsername, discordName, email, hashedPassword);
    res.redirect("/login");
}