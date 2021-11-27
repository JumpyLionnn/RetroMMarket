console.log("service worket started");

self.addEventListener("push", (e: any) => {
    const data = e.data.json();
    (self as any).registration.showNotification("RetroMMarket", {
        body: data.message, 
        icon: "../assets/icon.png"
    })
});