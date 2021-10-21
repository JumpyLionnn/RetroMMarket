async function sellRoute(req: ExpressRequest, res: ExpressResponse){
    const item = req.body.item;
    if(typeof item !== "string"){
        return res.status(400).send("the item name is not valid.");
    }
    if(items[item] === undefined){
        return res.status(400).send("the item does not exist.");
    }

    const category = items[item].category;

    const price = parseInt(req.body.price as string);
    if(typeof price !== "number"){
        return res.status(400).send("the price is not valid.");
    }
    if(price <= 0){
        return res.status(400).send("the price is not valid.");
    }

    const amount = parseInt(req.body.amount as string);
    if(typeof amount !== "number"){
        return res.status(400).send("the amount is not valid.");
    }
    if(amount <= 0){
        return res.status(400).send("the amount is not valid.");
    }

    if(await countUsersSellOffers(req.user.id) > sellOffersLimit){
        return res.status(400).send(`you already reached the sell offer limit.(${sellOffersLimit})`);
    }

    await addSellOffer(item, category, price, amount, req.user.id);
    res.send("success");
}