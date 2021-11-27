async function sellPageRoute(req: ExpressRequest, res: ExpressResponse, errorMessage: string){
    
    res.render("sell.html", {loggedIn: true, errorMessage: errorMessage, admin: req.user.admin, notifications: await getNotificationsCount(req.user.id)});
}