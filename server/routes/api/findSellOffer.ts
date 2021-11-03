async function findSellOfferRoute(req: ExpressRequest, res: ExpressResponse){
    let dbQuery = `SELECT sellOffers.id, item, category, price, amount, sellerId, retrommousername, discordname
     FROM sellOffers, users
     WHERE users.id = sellerid AND amount > 0 AND users.id != ${req.user.id} AND done = false`;

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

    const onlineUsers = await getUsersIdIfOnline();

    const onlineSellersOnlyString = req.query.onlineSellersOnly;
    if(onlineSellersOnlyString === "true"){
        
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

    let sortBy = req.query.sortBy;
    if(sortBy !== "price" && sortBy !== "date" && sortBy !== undefined) {
        return res.status(400).send("sortBy can only be price or date.");
    }
    else if(sortBy !== undefined){
        if(sortBy === "date"){
            sortBy = "sellOffers.date";
        }
        const ascending = req.query.ascending;
        if(ascending === "true"){
            dbQuery += ` ORDER BY ${sortBy} ASC`;
            
        }
        else if(ascending === "false"){
            dbQuery += ` ORDER BY ${sortBy} DESC `;
        }
        else if(ascending !== undefined){
            return res.status(400).send("ascending can only be true or false.");
        }
        else{
            dbQuery += ` ORDER BY ${sortBy} ASC`;
        }
    }

    dbQuery += ` LIMIT ${pageSize}`;

    const page = req.query.page;
    const isNumber = isNumeric(page);
    if(!isNumber && page !== undefined){
        
        return res.status(400).send("the page must be a positive number");
    }
    else if(isNumber){    
        const pageNumber = parseInt(page);
        if(pageNumber >= 0){
            dbQuery += ` OFFSET ${pageNumber * pageSize}`;
        }
        else{
            return res.status(400).send("the page must be a positive number");
        }
    }
    const rows = (await client.query(dbQuery)).rows;
    rows.forEach((row: any) =>{
        if(onlineUsers.filter((user: any) => user.id === row.sellerid).length > 0){
            row.sellerStatus = "online";
        }
        else{
            row.sellerStatus = "offline";
        }
    });
    res.send(rows);
}