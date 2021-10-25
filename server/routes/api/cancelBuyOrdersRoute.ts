async function cancelBuyOrderRoute(req: ExpressRequest, res: ExpressResponse){
    const buyOrderId = req.body.buyOrderId;
    if(typeof buyOrderId !== "number"){
        return res.status(400).send("the sell offer id is not valid.");
    }
    if(buyOrderId < 0){
        return res.status(400).send("the sell offer id is not valid.");
    }
    const order = await getOrderById(buyOrderId);
    if(order.buyerid !== req.user.id){
        return res.status(400).send("you dont own this offer.");
    }

    if(order.done){
        return res.status(400).send("this offer is already done.");
    }

    client.query("UPDATE sellOffers SET amount = amount + $2 WHERE id = $1;", [order.sellofferid, order.amount]);
    client.query("UPDATE buyOrders SET done = true, canceled = true WHERE id = $1;", [order.id]);
    res.send("success");

}