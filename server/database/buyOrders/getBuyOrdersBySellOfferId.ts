async function getBuyOrdersBySellOfferId(sellOfferId: number){
    return (await client.query(`SELECT buyOrders.id, buyerid, amount, sellerdelivered, buyerdelivered, retrommousername, discordname
     FROM buyOrders, users
     WHERE sellOfferId = $1 AND users.id = buyerId;
     `, [sellOfferId])).rows;
}