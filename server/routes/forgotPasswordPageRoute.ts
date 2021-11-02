async function forgotPasswordPageRoute(req: ExpressRequest, res: ExpressResponse){
    res.render("forgotPassword.html", {loggedIn: false});
}