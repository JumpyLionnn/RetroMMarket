async function notify(userId: number, message: string){
    const user = await getUserById(userId);
    
    await client.query("INSERT INTO notifications (userId, message, date) VALUES ($1, $2, $3);", [userId, message, Date.now()]);
    
    if(user.notifications === true){
        const pushSubscription = {
            endpoint: user.notificationsendpoint,
            keys: {
                p256dh: user.notificationsp256dh,
                auth: user.notificationsauth
              }
        };
        const payload = JSON.stringify({message});
        await webpush.sendNotification(
            pushSubscription,
            payload
        );
    }
}