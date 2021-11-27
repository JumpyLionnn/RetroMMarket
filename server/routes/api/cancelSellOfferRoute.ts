async function cancelSellOfferRoute(req: ExpressRequest, res: ExpressResponse){
    const sellOfferId = req.body.sellOfferId;
    if(typeof sellOfferId !== "number"){
        return res.status(400).send("the sell offer id is not valid.");
    }
    if(sellOfferId < 0){
        return res.status(400).send("the sell offer id is not valid.");
    }
    const offer = await getSellOfferById(sellOfferId);
    if(offer.sellerid !== req.user.id){
        return res.status(400).send("you dont own this offer.");
    }

    if(offer.done){
        return res.status(400).send("this offer is already done.");
    }
    const orders = (await client.query("SELECT * FROM buyOrders WHERE sellOfferId = $1 AND done = false;", [offer.id])).rows;
    for (let i = 0; i < orders.length; i++) {
        const order = orders[i];
        notify(order.buyerid, `Your buy order of ${offer.item} got canceled by ${req.user.retrommousername}.`);
    }
    client.query("DELETE FROM sellOffers WHERE id = $1;", [offer.id]);
    res.send("success");
}