async function adminOnly(req: ExpressRequest, res: ExpressResponse, next: () => void) {
    if(req.user.admin){
        return next();
    }
    return res.redirect("/");
}