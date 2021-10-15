async function buyOrderDeliveredRoute(req: ExpressRequest, res: ExpressResponse){
    const orderId = req.body.orderId;
    if(typeof orderId !== "number"){
        return res.status(400).send("the order id is not valid.");
    }
    const order = await getOrderById(orderId);
    if(order === null){
        return res.status(400).send("the order id is not valid.");
    }
    
    if(order.sellerId === req.user.id){
        if(order.sellerdelivered === true){
            return res.status(400).send("You already delivered this order.");
        }
        client.query("UPDATE buyOrders SET sellerDelivered = true WHERE id = $1", [orderId]);
    }
    else if(order.buyerid === req.user.id){
        if(order.buyerdelivered === true){
            return res.status(400).send("You already got this order.");
        }
        client.query("UPDATE buyOrders SET buyerDelivered = true WHERE id = $1", [orderId]);
    }
    else{
        return res.status(400).send("You dont own this order.");
    }
    res.send("success");
}