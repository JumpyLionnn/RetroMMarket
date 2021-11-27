async function getNotificationsCount(userId: number){
    const notificationsCount = (await client.query("SELECT COUNT(*) FROM notifications WHERE userId = $1 AND seen = false", [userId])).rows[0].count;
    return notificationsCount == 0 ? null : notificationsCount;

}