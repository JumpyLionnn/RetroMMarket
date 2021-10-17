async function changeDiscordNameRoute(req: ExpressRequest, res: ExpressResponse){
    const discordName = req.body.discordName;
    if(typeof discordName !== "string"){
        return res.status(400).send("the discord name is invalid");
    }
    if(!discordNameVerification.test(discordName) || discordName.length > 255){
        return res.status(400).send("the discord name is invalid");
    }
    await changeDiscordName(discordName, req.user.id);
    res.send("success");
}