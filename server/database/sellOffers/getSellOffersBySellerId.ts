async function getSellOffersBySellerId(sellerId: number){
    return (await client.query("SELECT * FROM sellOffers WHERE sellerid = $1", [sellerId])).rows;
}