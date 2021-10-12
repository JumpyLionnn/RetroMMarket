function registerPageRoute(req: ExpressRequest, res: ExpressResponse, templateVariables: any){
    res.render("register.html", templateVariables);
}