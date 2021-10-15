async function getSellOffersRoute(req: ExpressRequest, res: ExpressResponse){
    const offers = await getSellOffersBySellerId(req.user.id);

    for (let index = 0; index < offers.length; index++) {
        const offer = offers[index];
        offer["buyOrders"] = await getBuyOrdersBySellOfferId(offer.id);
    }

    res.send(offers);
}
