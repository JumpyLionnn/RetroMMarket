enum sortTypes {
    ASC = "ASC",
    DESC = "DESC"
};

interface Item {
    image: string,
    itemName: string,
    category: string,
    seller: string,
    sellerStatus: string,
    sellOrderId: number,
    itemCount: number,
    price: number,
}

class ItemCard extends HTMLDivElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
        <div id="item-card">
            <div id="item-preview">
                <img id="item-image" src="" alt="">
                <span id="item-name"></span>
                <span id="category-name"></span>
            </div>
            <div id="seller-details">
                <span id="seller-name"></span>
                <span id="seller-status">&#9679;</span>
            </div>
            <div id="item-details">
                <div id="item-count-selector">
                    <div>Item count:</div>
                    <input type="number" value="1" id="{{item.sellOrderId}}" min="1" max="{{item.count}}">
                </div>
                <div id="price-number">{{item.price}}</div>
            </div>
            <div id="buy-button-container">
                <button id="buy-button" value="{{item.sellOrderId}}" onclick="buyItem(this.value)">BUY NOW</button>
            </div>
        </div>
        `;
    }
}

customElements.define("item-card", ItemCard, { extends: "div" });

async function getSellOffers(query: string, category: string, onlineSellersOnly: boolean, sortBy: sortTypes, upperLimit: number) {
    const url = `/find?query=${query}&category=${category}&onlineSellersOnly=${onlineSellersOnly}&sort=${sortBy}&to=${upperLimit}`;
    const data = {
        query: query,
        category: category,
        onlineSellersOnly: onlineSellersOnly,
        sort: sortBy,
        to: upperLimit
    };
    const res = await fetch(url, {
        method: "GET",
        headers: {"Content-Type": "application/json"}
    });
    console.log(res)
    return res.json().then(data => {
        data.map((item: any) => {
            const wasd = {
            image: item.image,
            itemName: item.itemName,
            category: item.category,
            seller: item.retrommousername,
            sellerStatus: "",               // TODO: implement
            sellOrderId: item.id, // just id?
            itemCount: item.amount,
            price: item.price
            }
            console.log(wasd);
            return wasd
        })
    })
}

function renderItems(query: string, category: string, onlineSellersOnly: boolean, sortBy: sortTypes, upperLimit: number) {
    const items = getSellOffers(query, category, onlineSellersOnly, sortBy, upperLimit) as any;
    console.log(items);
    const fragment = document.createElement("div", { is: "item-card" });
    
    items.forEach((item: Item) => {
        const instance = document.importNode(fragment, true);
        (<HTMLImageElement>instance.querySelector("#item-image")).src = item.image;
        (<HTMLSpanElement>instance.querySelector("#item-name")).innerHTML = item.itemName;
        (<HTMLSpanElement>instance.querySelector("#category-name")).innerHTML = item.category;
        (<HTMLSpanElement>instance.querySelector("#seller-name")).innerHTML = item.seller;
        (<HTMLSpanElement>instance.querySelector("#seller-status")).style.color = (item.sellerStatus === "online") ? "green" : "red";

        document.getElementById("items-list")?.appendChild(instance);
    })
}

renderItems("", "Weapons", false, sortTypes.ASC, 10);