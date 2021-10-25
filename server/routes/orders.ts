function ordersPageRoute(req: ExpressRequest, res: ExpressResponse){
    res.render("orders.html", {loggedIn: true});
}