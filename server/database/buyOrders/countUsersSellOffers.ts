async function countUsersBuyOrders(id: number){
   return parseInt((await client.query("SELECT COUNT(*) FROM buyOrders WHERE buyerId = $1", [id])).rows[0].count);
}