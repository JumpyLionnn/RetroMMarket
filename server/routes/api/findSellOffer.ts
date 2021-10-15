async function findSellOfferRoute(req: ExpressRequest, res: ExpressResponse){

    let dbQuery = `SELECT sellOffers.id, item, category, price, amount, sellerId, retrommousername FROM sellOffers, users
     WHERE users.id = sellerid AND amount > 0`;

    const query = req.query.query;
    if(typeof query === "string"){
        if(query.length < 50){
            dbQuery += ` AND item ILIKE '%${query.trim()}%'`
        }
        else{
        return res.status(400).send("the query is too long.");
        }
    }
    else if(query !== undefined){
        return res.status(400).send("the query is not valid.");
    }
    

    const categoryFilter = req.query.category;
    if(!categories.includes(categoryFilter) && categoryFilter !== undefined){
        return res.status(400).send("category is not valid.");
    }
    else if(categoryFilter !== undefined){
        dbQuery += ` AND category = '${categoryFilter}'`;
    }

    const onlineSellersOnlyString = req.query.onlineSellersOnly;
    if(onlineSellersOnlyString === "true"){
        const onlineUsers = await getUsersIdIfOnline();
        if(onlineUsers.length === 0){
            return res.status(400).send("There are no sell offers available from online users.");
        }
        let onlineUsersIds = "";
        for(let i = 0; i < onlineUsers.length; i++){
            onlineUsersIds += onlineUsers[i].id;
            if(i < onlineUsers.length - 1){
                onlineUsersIds += ",";
            }
        }
        dbQuery += ` AND sellerId IN (${onlineUsersIds})`;
    }
    else if(onlineSellersOnlyString !== "false" && onlineSellersOnlyString !== undefined){
        return res.status(400).send("onlineSellersOnly can only be true or false.");
    }

    const sort = req.query.sort;
    if(sort === "ASC" || sort === "DESC"){
        dbQuery += ` ORDER BY price ${sort}`;
        
    }
    else if(sort !== undefined){
        return res.status(400).send("sort can only be ASC or DESC.");
    }
    res.send((await client.query(dbQuery)).rows);
}