async function buyOrderDeliveredRoute(req: ExpressRequest, res: ExpressResponse){
    const orderId = req.body.orderId;
    if(typeof orderId !== "number"){
        return res.status(400).send("the order id is not valid.");
    }
    const order = await getOrderById(orderId);
    if(order === null){
        return res.status(400).send("the order id is not valid.");
    }
    
    if(order.sellerid === req.user.id){
        if(order.sellerdelivered){
            return res.status(400).send("You already delivered this order.");
        }
        client.query("UPDATE buyOrders SET sellerDelivered = true WHERE id = $1", [orderId]);
    }
    else if(order.buyerid === req.user.id){
        if(order.buyerdelivered){
            return res.status(400).send("You already got this order.");
        }
        client.query("UPDATE buyOrders SET buyerDelivered = true WHERE id = $1;", [orderId]);
    }
    else{
        return res.status(400).send("You dont own this order.");
    }
    if(order.sellerdelivered || order.buyerdelivered){
        client.query(`UPDATE buyOrders SET done = true WHERE id = $1;`, [orderId]);
        if((await client.query("SELECT amount FROM sellOffers WHERE id = $1", [order.sellOfferid])).rows[0].amount === 0){
            const undoneBuyOrdersCount = (await client.query(`SELECT COUNT(*) FROM buyOrders WHERE done = false AND sellOfferId = $1`, [order.sellofferid])).rows[0].count;
            if(undoneBuyOrdersCount === 0){
                client.query("UPDATE sellOffers SET done = true WHERE id = $1;", [order.sellofferid]);
            }
        }
    }

    res.send("success");
}