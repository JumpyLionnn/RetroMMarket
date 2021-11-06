function dashboardPageRoute(req: ExpressRequest, res: ExpressResponse){
    res.render("dashboard.html", {loggedIn: true, admin: req.user.admin});
}