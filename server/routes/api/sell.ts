async function sellRoute(req: ExpressRequest, res: ExpressResponse){
    const item = req.body.item;
    if(typeof item !== "string"){
        return sellPageRoute(req, res, "The item name is not valid.");
    }
    if(items[item] === undefined){
        return sellPageRoute(req, res, "The item does not exist.");
    }

    const category = items[item].category;

    const price = parseInt(req.body.price as string);
    if(typeof price !== "number"){
        return sellPageRoute(req, res, "The price is not valid.");
    }
    if(price <= 0){
        return sellPageRoute(req, res, "The price is not valid.");
    }

    const amount = parseInt(req.body.amount as string);
    if(typeof amount !== "number"){
        return sellPageRoute(req, res, "The amount is not valid.");
    }
    if(amount <= 0){
        return sellPageRoute(req, res, "The amount is not valid.");
    }

    if(await countUsersSellOffers(req.user.id) >= sellOffersLimit){
        return sellPageRoute(req, res, `you already reached the sell offer limit.(${sellOffersLimit})`);
    }

    await addSellOffer(item, category, price, amount, req.user.id);
    res.redirect("/orders");
}