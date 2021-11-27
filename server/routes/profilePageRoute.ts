async function profilePageRoute(req: ExpressRequest, res: ExpressResponse){
    res.render("profile.html", Object.assign({
        loggedIn: true,
        email: req.user.email,
        RetroMMOUsername: req.user.retrommousername,
        discordName: req.user.discordname,
        admin: req.user.admin, 
        notifications: await getNotificationsCount(req.user.id),
        notificationEnabled: req.user.notifications
    }, await getUserStats(req.user.id)));
}