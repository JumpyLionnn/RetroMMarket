async function getRowsRoute(req: ExpressRequest, res: ExpressResponse){
    const result: any = {};

    result.activeUsers = parseInt((await client.query("SELECT COUNT(*) FROM users WHERE banned = false;")).rows[0].count);
    result.activeSellOffers = parseInt((await client.query("SELECT COUNT(*) FROM sellOffers WHERE done = false;")).rows[0].count);
    result.activeBuyOrders = parseInt((await client.query("SELECT COUNT(*) FROM buyOrders WHERE done = false;")).rows[0].count);

    result.users = await count("users");
    result.sellOffers = await count("sellOffers");
    result.buyOrders = await count("buyOrders");

    result.activeTotal = result.activeUsers + result.activeSellOffers + result.activeBuyOrders;
    result.total = result.users + result.sellOffers + result.buyOrders;
    res.send(result);
}

async function count(table: string): Promise<number>{
    return parseInt((await client.query(`SELECT COUNT(*) FROM ${table};`)).rows[0].count);
}