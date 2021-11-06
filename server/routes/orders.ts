async function ordersPageRoute(req: ExpressRequest, res: ExpressResponse){
    res.render("orders.html", {
        loggedIn: true, 
        ordersAmount: await countUsersBuyOrders(req.user.id),
        orderLimit: buyOrdersLimit,
        offersAmount: await countUsersSellOffers(req.user.id),
        offerLimit: sellOffersLimit,
        admin: req.user.admin
    });
}