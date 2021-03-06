async function buyRoute(req: ExpressRequest, res: ExpressResponse){
    const sellOfferId = req.body.sellOfferId;
    if(typeof sellOfferId !== "number"){
        return res.status(400).send("the sell offer id is not valid.");
    }
    const sellOffer = await getSellOfferById(sellOfferId);
    if(sellOffer === null) {
        return res.status(400).send("the sell offer id is not valid.");
    }
    if(sellOffer.sellerid === req.user.id){
        return res.status(400).send("You can not buy your own items.");
    }
    if(sellOffer.done || sellOffer.canceled) {
        return res.status(400).send("Item has been removed or bought by another user.")
    }

    const amount = req.body.amount;
    if(typeof amount !== "number"){
        return res.status(400).send("the amount is not valid.");
    }
    if(amount <= 0){
        return res.status(400).send("the amount is not valid.");
    }
    if(amount > sellOffer.amount){
        return res.status(400).send("the amount is not valid.");
    }
    if(await countUsersBuyOrders(req.user.id) >= buyOrdersLimit){
        return res.status(400).send(`you already reached the buy order limit.(${buyOrdersLimit})`);
    }
    notify(sellOffer.sellerid, `${req.user.retrommousername} placed a buy order on your ${sellOffer.item} sell offer.`);
    changeSellOfferAmount(sellOfferId, sellOffer.amount - amount);
    addBuyOrder(sellOfferId, req.user.id, amount);

    res.send("success");
}