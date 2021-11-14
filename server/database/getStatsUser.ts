async function getUserStats(userId: number){
    const buyOrdersResults = (await client.query("SELECT COALESCE(SUM(buyOrders.amount),0) AS amount, COALESCE(SUM(price * buyOrders.amount),0) AS price, COUNT(*) FROM buyOrders, sellOffers WHERE buyerId = $1 AND buyOrders.done = true AND sellOffers.id = sellOfferId;", [userId])).rows[0];
    const sellOffersResults = (await client.query("SELECT COALESCE(SUM(totalAmount),0) AS amount, COALESCE(SUM(price * totalAmount),0) AS price, COUNT(*) FROM sellOffers WHERE sellerId = $1 AND done = true;", [userId])).rows[0];
    const notCompletedSellOffersResults = (await client.query("SELECT COALESCE(SUM(buyOrders.amount),0) AS amount, COALESCE(SUM(price * buyOrders.amount),0) AS price FROM buyOrders, sellOffers WHERE sellOffers.id = sellOfferId AND buyOrders.done = true AND sellOfferId IN (SELECT id FROM sellOffers WHERE sellerId = $1 AND done = false);", [userId])).rows[0];
    return { 
        completedBuyOrders: buyOrdersResults.count,
        goldSpent:  buyOrdersResults.price,
        itemsBought: buyOrdersResults.amount,
        completedSellOffers: sellOffersResults.count,
        goldEarned: parseInt(sellOffersResults.price) + parseInt(notCompletedSellOffersResults.price),
        itemsSold: parseInt(sellOffersResults.amount) + parseInt(notCompletedSellOffersResults.amount)
    } as {[key: string]: number}

}   