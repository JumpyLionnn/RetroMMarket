import { dialog } from "./alert.js"

async function getBuyOrders() {
    const url = `/buyOrders`;
    const res = await fetch(url, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        }
    });

    if(!res.ok) console.log("You have no buying orders.")

    return await res.json();
}

async function getSellOffers() {
    const url = `/sellOffers`;
    const res = await fetch(url, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        }
    });

    if(!res.ok) console.log("You have no sell offers.")

    return await res.json();
}

async function renderOrders() {
    const orders = await getBuyOrders();

    const table = document.querySelector("#buying-list table") as HTMLTableElement;
    table.innerHTML = "";
    
    if(orders === undefined || orders.length === 0) {
        console.log("No orders found with the current search parameters.")
    } else {
        table.innerHTML = `<tr>
            <th>Item</th>
            <th>Amount</th>
            <th>Price</th>
            <th>Seller</th>
            </tr>`;
        orders.forEach((order: any) => {
            const itemName = document.createElement("td");
            const itemAmount = document.createElement("td");
            const itemPrice = document.createElement("td");
            const sellerName = document.createElement("td");
            const cancelButton = document.createElement("button");
            const receiveButton = document.createElement("button");
            const buttons = document.createElement("td");
            
            itemName.innerHTML = order.item;
            itemAmount.innerHTML = order.amount;
            itemPrice.innerHTML = order.price;
            sellerName.innerHTML = `<div>${order.retrommousername}</div><div>${order.discordname}</div>`;
            cancelButton.onclick = () => cancelOrder(order.id);
            cancelButton.innerText = "Cancel Order"
            cancelButton.disabled = order.buyerdelivered || order.sellerdelivered || order.done || order.canceled;
            receiveButton.onclick = () => receiveOrder(order.id);
            receiveButton.innerText = "Mark as Received"
            receiveButton.disabled = order.buyerdelivered || order.done || order.canceled;
            buttons.append(cancelButton, receiveButton);
            const tr = document.createElement("tr");
            tr.append(itemName, itemAmount, itemPrice, sellerName, buttons);
            table.append(tr);
        });
        
    }
}

async function renderOffers() {
    const offers = await getSellOffers();

    const table = document.querySelector("#selling-list table") as HTMLTableElement;
    table.innerHTML = "";
   
    if(offers === undefined || offers.length === 0) {
        console.log("No offers found with the current search parameters.")
    } else {
        table.innerHTML = `<tr>
            <th>Item</th>
            <th>Amount</th>
            <th>Price</th>
            </tr>`;
        offers.forEach((offer: any) => {
            const itemName = document.createElement("td");
            const itemAmount = document.createElement("td");
            const itemPrice = document.createElement("td");
            const buyersButton = document.createElement("button");
            const cancelButton = document.createElement("button");
            
            itemName.innerHTML = offer.item;
            itemAmount.innerHTML = offer.amount;
            itemPrice.innerHTML = offer.price;
            
            buyersButton.innerText = `Show ${offer.buyOrders.length} buyer(s)`;
            buyersButton.disabled = offer.buyOrders.length === 0;
            cancelButton.onclick = () => cancelOffer(offer.id);
            cancelButton.innerText = "Remove Offer"

            let tr = document.createElement("tr");
            tr.append(itemName, itemAmount, itemPrice, buyersButton, cancelButton);
            table.append(tr);

            let buyOrderRows: HTMLTableRowElement[] = [];
            offer.buyOrders.forEach((order: any) => {
                const buyOrderID = document.createElement("td");
                const buyerName = document.createElement("td");
                const buyerAmount = document.createElement("td");
                
                buyOrderID.innerHTML = order.id;
                buyerName.innerHTML = `<div>${order.retrommousername}</div><div>${order.discordname}</div>`;
                buyerAmount.innerHTML = order.amount;
                
                const receiveButton = document.createElement("button");        
                receiveButton.onclick = () => receiveOrder(order.id);
                receiveButton.innerText = "Mark as Delivered"
                receiveButton.disabled = order.sellerdelivered;
                
                tr = document.createElement("tr");
                tr.style.display = "none";
                tr.id = "hidden-row";
                tr.append(buyOrderID, buyerName, buyerAmount, receiveButton)
                buyOrderRows.push(tr);
                table.append(tr);
            });
            buyersButton.onclick = () => toggleBuyersList(buyOrderRows, buyersButton, offer.buyOrders.length);
        });
        
    }
}

function toggleBuyersList(container: HTMLTableRowElement[], button: HTMLButtonElement, orders: number) {
    if(container[0].style.display === "none") {
        container.every((row: HTMLTableRowElement) => row.style.display = "table-row");
        button.innerText = `Hide ${orders} buyer(s)`;
    } else {
        container.every((row: HTMLTableRowElement) => row.style.display = "none");
        button.innerText = `Show ${orders} buyer(s)`;
    }
}

renderOrders();
renderOffers();

async function cancelOrder(id: string) {
    dialog("Cancel Order", "Are you sure you want to cancel the order?", async (result: boolean) => {
        if(result) {
            const url = `/cancelOrder`;
            console.log(id);
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    buyOrderId: parseInt(id),
                })
            });
            console.log(res);
            if(!res.ok) throw new Error("error");
            renderOrders();
        }
    });
}

async function cancelOffer(id: string) {
    dialog("Cancel Offer", "Are you sure you want to cancel the offer?", async (result: boolean) => {
        if(result) {
            const url = `/cancelOffer`;
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    sellOfferId: parseInt(id),
                })
            });
            console.log(res);
            if(!res.ok) throw new Error("error");
            renderOffers();
        }
    });
}

async function receiveOrder(id: string) {
    dialog("deliver", "Are you sure you want to mark this order as delivered?", async (result: boolean) => {
        if(result){
            const url = `/buyOrderDelivered`;
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    orderId: parseInt(id),
                })
            });
            if(!res.ok) throw new Error("error");
            renderOffers();
        }
    });
}

