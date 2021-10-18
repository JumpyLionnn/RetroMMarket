async function changeRetroMMOUsernameRoute(req: ExpressRequest, res: ExpressResponse){
    const RetroMMOUsername = req.body.RetroMMOUsername;
    if(typeof RetroMMOUsername !== "string"){
        return res.status(400).send("the RetroMMO username is invalid");
    }
    if(RetroMMOUsername.length > 255){
        return res.status(400).send("the RetroMMO username is invalid");
    }
    if(await checkUserRetroMMOUsername(RetroMMOUsername)){
        return res.status(400).send("The RetroMMO username already exists.");
    }
    await changeRetroMMOUsername(RetroMMOUsername, req.user.id);
    res.send("success");
}