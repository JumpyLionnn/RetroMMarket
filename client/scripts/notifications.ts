const notificationsButton = document.getElementById("bell-icon") as HTMLImageElement;

const notificationsList = document.getElementById("notifications-list") as HTMLDivElement;
const notificationNumber = document.getElementById("notification-number") as HTMLDivElement;

notificationsButton.addEventListener("click", async () => {
    notificationsList.hidden = !notificationsList.hidden;
    if(notificationsList.hidden){
        return;
    }
    const notificationsResponse = await fetch("/notifications");
    if(!notificationsResponse.ok){
        location.reload();
    }
    const notifications = await notificationsResponse.json();
    if(notifications.length === 0){
        notificationsList.innerText = "There are no notifications for you.";
        return;
    }
    
    notificationsList.innerHTML = "";
    notificationNumber.hidden = true;
    notifications.forEach((notification: any) => {
        const notificationDiv = Object.assign(document.createElement("div"), {
            id: "notification",
        });

        const notificationMessageDiv = Object.assign(document.createElement("div"), {
            id: "notification-message",
            innerText: notification.message
        });

        const timeDifference = Date.now() - notification.date;
        let timeDifferenceMessage;
        const seconds = timeDifference / 1000;
        if(seconds > 60){
            const minutes = seconds / 60;
            if(minutes > 60){
                const hours = minutes / 60;
                if(hours > 24){
                    const days = hours / 24;
                    timeDifferenceMessage = `${Math.round(days)} days ago.`;
                }
                else{
                    timeDifferenceMessage = `${Math.round(hours)} hours ago.`;
                }
            }
            else{
                timeDifferenceMessage = `${Math.round(minutes)} minutes ago.`;
            }
        }
        else{
            timeDifferenceMessage = `less than a minute ago.`;
        }
        const notificationDateDiv = Object.assign(document.createElement("div"), {
            id: "notification-date",
            innerText: timeDifferenceMessage
        });

        notificationDiv.appendChild(notificationMessageDiv);
        notificationDiv.appendChild(notificationDateDiv);

        notificationsList.appendChild(notificationDiv);
    });
});