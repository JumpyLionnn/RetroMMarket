async function getBuyOrdersRoute(req: ExpressRequest, res: ExpressResponse){
    res.send(await getOrdersByBuyerId(req.user.id));
}