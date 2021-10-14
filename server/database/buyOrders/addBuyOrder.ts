async function addBuyOrder(sellOfferId: number, buyerId: number, amount: number){
    await client.query("INSERT INTO buyOrders(sellOfferId, buyerId, amount, date) VALUES($1, $2, $3, $4)",
    [sellOfferId, buyerId, amount, Date.now()],
    (error: Error, response: any)=>{
        if(error){
            console.log(error);
        }
    });
}