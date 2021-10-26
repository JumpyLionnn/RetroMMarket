async function getOrderById(id: number){
    const rows = (await client.query(`SELECT sellofferid, buyerid, sellerid, buyOrders.amount, sellerdelivered, buyerdelivered, buyOrders.date, buyOrders.done, buyOrders.canceled, price, item, category
     FROM buyOrders, sellOffers 
     WHERE buyOrders.id = $1 AND sellOffers.id = buyOrders.sellOfferId`,[id])).rows;
    return rows.length === 0 ? null : rows[0];
}