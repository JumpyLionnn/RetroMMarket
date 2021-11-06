async function profilePageRoute(req: ExpressRequest, res: ExpressResponse){
    res.render("profile.html", {
        loggedIn: true,
        email: req.user.email,
        RetroMMOUsername: req.user.retrommousername,
        discordName: req.user.discordname,
        admin: req.user.admin
    });
}