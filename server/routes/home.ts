function homePageRoute(req: ExpressRequest, res: ExpressResponse){
    res.sendFile(path.join(cwd ,"client/index.html"));
}