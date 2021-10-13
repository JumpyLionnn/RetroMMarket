async function addSellOffer(item: string, price: number, amount: number, sellerId: number){
    await client.query("INSERT INTO sellOffers(item, price, amount, sellerId, date) VALUES($1, $2, $3, $4, $5)",
    [item, price, amount, sellerId, Date.now()],
    (error: Error, response: any)=>{
        if(error){
            console.log(error);
        }
    });
}