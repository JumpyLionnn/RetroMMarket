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

    client.query("UPDATE sellOffers SET done = true, canceled = true WHERE id = $1;", [offer.id]);
    client.query("UPDATE buyOrders SET done = true, canceled = true WHERE sellOfferId = $1 AND done = false;", [sellOfferId]);
    res.send("success");

}