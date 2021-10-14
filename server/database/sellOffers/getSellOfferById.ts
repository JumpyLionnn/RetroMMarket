async function getSellOfferById(id: number){
    let rows = (await client.query("SELECT * FROM sellOffers WHERE id = $1", [id])).rows;
    return rows.length === 0 ? null : rows[0];
}