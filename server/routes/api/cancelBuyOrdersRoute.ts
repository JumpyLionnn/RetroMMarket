async function cancelBuyOrderRoute(req: ExpressRequest, res: ExpressResponse){
    const buyOrderId = req.body.buyOrderId;
    if(typeof buyOrderId !== "number"){
        return res.status(400).send("the buy order id is not valid.");
    }
    if(buyOrderId < 0){
        return res.status(400).send("the buy order id is not valid.");
    }
    const order = await getOrderById(buyOrderId);
    if(order.buyerid !== req.user.id){
        return res.status(400).send("you dont own this order.");
    }

    if(order.done){
        return res.status(400).send("this offer is already done.");
    }
    const offer = await getSellOfferById(order.sellofferid);
    notify(offer.sellerid, 
        `One of your orders of your ${offer.item} sell offer got canceled by ${req.user.retrommousername}.`
        );
    await client.query("UPDATE sellOffers SET amount = amount + $2 WHERE id = $1;", [order.sellofferid, order.amount]);
    await client.query("DELETE FROM buyOrders WHERE id = $1;", [buyOrderId]);
    res.send("success");

}