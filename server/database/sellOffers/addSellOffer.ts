async function addSellOffer(item: string, category: string, price: number, amount: number, sellerId: number){
    await client.query("INSERT INTO sellOffers(item, category, price, amount, sellerId, date) VALUES($1, $2, $3, $4, $5, $6)",
    [item, category, price, amount, sellerId, Date.now()],
    (error: Error, response: any)=>{
        if(error){
            console.log(error);
        }
    });
}