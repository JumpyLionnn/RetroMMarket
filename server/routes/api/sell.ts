async function sellRoute(req: ExpressRequest, res: ExpressResponse){
    const item = req.body.item;
    if(typeof item !== "string"){
        return res.status(400).send("the item name is not valid.");
    }
    if(items[item] === undefined){
        return res.status(400).send("the item does not exist.");
    }

    const category = items[item].category;

    const price = req.body.price;
    if(typeof price !== "number"){
        return res.status(400).send("the price is not valid.");
    }
    if(price < 0){
        return res.status(400).send("the price is not valid.");
    }

    const amount = req.body.amount;
    if(typeof amount !== "number"){
        return res.status(400).send("the amount is not valid.");
    }
    if(amount <= 0){
        return res.status(400).send("the amount is not valid.");
    }

    await addSellOffer(item, category, price, amount, req.user.id);
    res.send("success");
}