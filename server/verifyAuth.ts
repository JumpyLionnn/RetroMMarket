function verifyAuth(req: ExpressRequest, res: ExpressResponse, next: () => void){
    const token = req.cookies["auth-token"];
    if(!token){
        return res.redirect("/login");
    }
    try{
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    }
    catch(error){
        return res.redirect("/login");
    }
}