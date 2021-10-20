let orders: any;

class OrderCard extends HTMLDivElement {
    constructor() {
        super();
        this.innerHTML = `
        <div id="order-card">
            <div id="item-preview">
                <span id="item-name"></span>
            </div>
            <div id="seller-details">
                <span id="seller-name"></span>
                <span id="seller-status">&#9679;</span>
            </div>
            <div id="item-details">
                <span id="item-count"></span>
                <span id="item-price"></span>
            </div>
            <div id="order-buttons">
                <button id="cancel-button" value="" onclick="cancelOrder(this.value)">CANCEL ORDER</button>
                <button id="receive-button" value="" onclick="receiveOrder(this.value)">ITEM RECEIVED</button>
            </div>
        </div>
        `;
    }
}

customElements.define("order-card", OrderCard, { extends: "div" });

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

async function renderOrders() {
    orders = await getBuyOrders();

    if(orders === undefined || orders.length === 0) {
        console.log("No orders found with the current search parameters.")
        return;
    };

    console.log(orders);

    const fragment = document.createElement("div", { is: "order-card" });
    (<HTMLDivElement>document.getElementById("orders-list")).innerHTML = "";
    orders?.forEach((item: any) => {
        const instance = document.importNode(fragment, true);
        (<HTMLSpanElement>instance.querySelector("#item-name")).innerHTML = item.item;
        (<HTMLSpanElement>instance.querySelector("#seller-name")).innerHTML = item.retrommousername;
        (<HTMLSpanElement>instance.querySelector("#seller-status")).style.color = (item.sellerStatus === "online") ? "green" : "red";
        (<HTMLInputElement>instance.querySelector("#item-count")).innerHTML = `${item.amount.toString()}x for `;
        (<HTMLDivElement>instance.querySelector("#item-price")).innerHTML = `${item.price.toString()}g`;
        (<HTMLButtonElement>instance.querySelector("#cancel-button")).value = item.id.toString();
        (<HTMLButtonElement>instance.querySelector("#receive-button")).value = item.id.toString();
        (<HTMLButtonElement>instance.querySelector("#receive-button")).disabled = item.buyerdelivered;
        document.getElementById("orders-list")?.appendChild(instance);
    })
}

renderOrders();

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
}

