async function profilePageRoute(req: ExpressRequest, res: ExpressResponse){
    const user = await getUserById(req.user.id);
    res.render("profile.html", {
        loggedIn: true,
        email: user.email,
        RetroMMOUsername: user.retrommousername,
        discordName: user.discordname,
    });
}