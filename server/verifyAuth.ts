function verifyAuth(req: ExpressRequest, res: ExpressResponse, next: () => void){
    const token = req.cookies["auth-token"];
    if(!token){
        return res.redirect("/login");
    }
    try{
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        // make sure the token has not expired(expire time: 3 hours)
        if(Math.floor(Date.now() / 1000) - verified.iat > 60 * 60 * 3){ 
            throw new Error();
        }
        req.user = verified;
        next();
    }
    catch(error){
        return res.redirect("/login");
    }
}