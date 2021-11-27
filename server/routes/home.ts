async function homePageRoute(req: ExpressRequest, res: ExpressResponse){
    res.render("index.html", {
        loggedIn: true, 
        admin: req.user.admin, 
        notifications: await getNotificationsCount(req.user.id)
    });
}