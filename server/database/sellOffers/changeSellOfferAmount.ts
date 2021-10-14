async function changeSellOfferAmount(sellOfferId: number, newAmount: number){
    await client.query("UPDATE sellOffers SET amount = $1 WHERE id = $2", [newAmount,sellOfferId]);
}