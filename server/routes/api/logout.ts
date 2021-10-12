function logoutRoute(req: ExpressRequest, res: ExpressResponse){
    res.cookie("auth-token", "");
    res.redirect("/login");
}