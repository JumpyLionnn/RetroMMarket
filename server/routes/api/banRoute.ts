async function banRoute(req: ExpressRequest, res: ExpressResponse){
    const name = req.body.name;
    if(name === undefined){
        res.status(400).send("the name is not valid");
    }
    const user = (await client.query("SELECT * FROM users WHERE retrommousername = $1;", [name])).rows[0];
    if(user === undefined) {
        res.status(400).send("the user does not exist");
    }
    if(user.banned){
        res.status(400).send("this user is already banned");
    }
    const buyersOrders = (await client.query("SELECT buyOrders.id, sellOffers.item FROM buyOrders WHERE sellOfferId IN (SELECT id FROM sellOffers WHERE sellerId = $1);")).rows;
    for (let i = 0; i < buyersOrders.length; i++) {
        const buyOrder = buyersOrders[i];
        notify(buyOrder.buyerid, 
            `Your buy order of ${buyOrder.item} got canceled because the seller ${name} got banned.`
            );
    }
    const buyOrders = (await client.query("SELECT sellerId, item FROM buyOrders, sellOffers WHERE buyerId = $1 AND sellOffers.id = sellofferid")).rows;
    for (let i = 0; i < buyOrders.length; i++) {
        const order = buyOrders[i];
        notify(order.buyerid, 
            `One of your orders of your ${order.item} sell offer got canceled because the buyer ${name} got banned.`
            );
    }
    await client.query("UPDATE users SET banned = true WHERE id = $1;", [user.id]);
    client.query("DELETE FROM sellOffers WHERE sellerId = $1 AND done = false;", [user.id]);
    client.query("DELETE FROM buyOrders WHERE buyerId = $1 AND done = false;", [user.id]);
    res.send("success");
}