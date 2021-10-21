function sellPageRoute(req: ExpressRequest, res: ExpressResponse){
    res.render("sell.html", {loggedIn: true});
}