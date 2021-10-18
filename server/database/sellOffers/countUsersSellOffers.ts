async function countUsersSellOffers(id: number){
   return parseInt((await client.query("SELECT COUNT(*) FROM sellOffers WHERE sellerId = $1", [id])).rows[0].count);
}