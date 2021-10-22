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

async function getSellOrders() {
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

    if(orders === undefined || orders.length === 0) {
        console.log("No orders found with the current search parameters.")
    } else {
        (<HTMLDivElement>document.getElementById("buying-list")).innerHTML = "";
        console.log(orders);
        const table = document.createElement("table");
        table.innerHTML = `<tr>
            <th>ID</th>
            <th>Item</th>
            <th>Amount</th>
            <th>Price</th>
            <th>Seller</th>
        </tr>`;
        orders.forEach((order: any) => {
            const orderID = document.createElement("td");
            const itemName = document.createElement("td");
            const itemAmount = document.createElement("td");
            const itemPrice = document.createElement("td");
            const sellerName = document.createElement("td");
            const cancelButton = document.createElement("button");
            const receiveButton = document.createElement("button");
            const buttons = document.createElement("td");
            
            orderID.innerHTML = order.id;
            itemName.innerHTML = order.item;
            itemAmount.innerHTML = order.amount;
            itemPrice.innerHTML = order.price;
            sellerName.innerHTML = order.retrommousername;
            cancelButton.onclick = () => cancelOrder(order.id);
            cancelButton.innerText = "Cancel Order"
            cancelButton.disabled = order.buyerdelivered || order.sellerdelivered;
            receiveButton.onclick = () => receiveOrder(order.id);
            receiveButton.innerText = "Mark as Received"
            receiveButton.disabled = order.buyerdelivered;
            buttons.append(cancelButton, receiveButton);
            const tr = document.createElement("tr");
            tr.append(orderID, itemName, itemAmount, itemPrice, sellerName, buttons);
            table.append(tr);
        });
        (<HTMLDivElement>document.getElementById("buying-list")).appendChild(table);
    }
}

async function renderOffers() {
    const offers = await getSellOrders();

    if(offers === undefined || offers.length === 0) {
        console.log("No orders found with the current search parameters.")
    } else {
        (<HTMLDivElement>document.getElementById("selling-list")).innerHTML = "";
        console.log(offers);
        const table = document.createElement("table");
        table.innerHTML = `<tr>
            <th>ID</th>
            <th>Item</th>
            <th>Amount</th>
            <th>Price</th>
        </tr>`;
        offers.forEach((offer: any) => {
            const offerID = document.createElement("td");
            const itemName = document.createElement("td");
            const itemAmount = document.createElement("td");
            const itemPrice = document.createElement("td");
            const buyersButton = document.createElement("button");
            const cancelButton = document.createElement("button");
            
            offerID.innerHTML = offer.id;
            itemName.innerHTML = offer.item;
            itemAmount.innerHTML = offer.amount;
            itemPrice.innerHTML = offer.price;
            
            buyersButton.innerText = `Show ${offer.buyOrders.length} buyer(s)`;
            buyersButton.disabled = offer.buyOrders.length === 0;
            cancelButton.onclick = () => cancelOrder(offer.id);
            cancelButton.innerText = "Remove Offer"
            cancelButton.disabled = offer.sellerdelivered;

            let tr = document.createElement("tr");
            tr.append(offerID, itemName, itemAmount, itemPrice, buyersButton, cancelButton);
            table.append(tr);

            let buyOrderRows: HTMLTableRowElement[] = [];
            offer.buyOrders.forEach((order: any) => {
                const buyOrderID = document.createElement("td");
                const buyerName = document.createElement("td");
                const buyerAmount = document.createElement("td");
                
                buyOrderID.innerHTML = order.id;
                buyerName.innerHTML = order.retrommousername;
                buyerAmount.innerHTML = order.amount;
                
                const receiveButton = document.createElement("button");        
                receiveButton.onclick = () => receiveOrder(order.id);
                receiveButton.innerText = "Mark as Delivered"
                receiveButton.disabled = order.sellerdelivered || order.buyerdelivered;
                
                tr = document.createElement("tr");
                tr.style.display = "none";
                tr.append(buyOrderID, buyerName, buyerAmount, document.createElement("td"), receiveButton)
                buyOrderRows.push(tr);
                table.append(tr);
            });
            buyersButton.onclick = () => toggleBuyersList(buyOrderRows);
        });
        (<HTMLDivElement>document.getElementById("selling-list")).appendChild(table);
    }
}

function toggleBuyersList(container: HTMLTableRowElement[]) {
    if(container[0].style.display === "none") {
        container.every((row: HTMLTableRowElement) => row.style.display = "table-row");
    } else {
        container.every((row: HTMLTableRowElement) => row.style.display = "none");
    }
}

renderOrders();
renderOffers();

async function cancelOrder(id: string) {
    //parseInt(id);
    console.log("Order canceled for item ", id)
}

async function receiveOrder(id: string) {
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
    console.log(res);
    if(!res.ok) throw new Error("error")
    renderOrders();
    renderOffers();
}

