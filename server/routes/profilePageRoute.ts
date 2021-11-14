async function profilePageRoute(req: ExpressRequest, res: ExpressResponse){
    res.render("profile.html", Object.assign({
        loggedIn: true,
        email: req.user.email,
        RetroMMOUsername: req.user.retrommousername,
        discordName: req.user.discordname,
        admin: req.user.admin
    }, await getUserStats(req.user.id)));
}