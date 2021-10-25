async function getOrdersByBuyerId(buyerId: number){
    return (await client.query(`SELECT buyOrders.id, item, category, sellerid, buyOrders.amount, sellerdelivered, buyerdelivered, price, retrommousername, discordname, sellOffers.done, sellOffers.canceled  
    FROM buyOrders, sellOffers, users
     WHERE buyOrders.buyerId = $1 AND sellOffers.id = buyOrders.sellOfferId AND users.id = sellOffers.sellerid`
     ,[buyerId])).rows;
}   