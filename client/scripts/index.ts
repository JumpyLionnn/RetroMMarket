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
        // TODO: Link onlclick here
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
                    <input class="item-count-number-input" type="number" value="1" id="" min="1" max="1">
                </div>
                <div id="price-number"></div>
            </div>
            <div id="buy-button-container">
                <button id="buy-button" value="" onclick="buyItem(this.value)">BUY NOW</button>
            </div>
        </div>
        `;
    }
}

customElements.define("item-card", ItemCard, { extends: "div" });

async function getSellOffers(query: string, category: string, onlineSellersOnly: boolean, sortBy: sortTypes, upperLimit: number) {
    const url = `/find?query=${query}&category=${category}&onlineSellersOnly=${onlineSellersOnly}&sort=${sortBy}&to=${upperLimit}`;
    console.log(url);
    const res = await fetch(url, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        }
    });

    if(!res.ok) throw new Error("error")

    return await res.json();
}

async function renderItems(query: string, category: string, onlineSellersOnly: boolean, sortBy: sortTypes, upperLimit: number) {
    const items: [] | undefined = await getSellOffers(query, category, onlineSellersOnly, sortBy, upperLimit);
    console.log(items);
    const fragment = document.createElement("div", { is: "item-card" });
    items?.map((item: any) => {
        return {
            image: item.image,
            itemName: item.itemName,
            category: item.category,
            seller: item.retrommousername,
            sellerStatus: (onlineSellersOnly) ? "online" : "offline",
            sellOrderId: item.id,
            itemCount: item.amount,
            price: item.price
        }
    });
    items?.forEach((item: Item) => {
        const instance = document.importNode(fragment, true);
        (<HTMLImageElement>instance.querySelector("#item-image")).src = item.image;
        (<HTMLSpanElement>instance.querySelector("#item-name")).innerHTML = item.itemName;
        (<HTMLSpanElement>instance.querySelector("#category-name")).innerHTML = item.category;
        (<HTMLSpanElement>instance.querySelector("#seller-name")).innerHTML = item.seller;
        (<HTMLSpanElement>instance.querySelector("#seller-status")).style.color = (item.sellerStatus === "online") ? "green" : "red";
        (<HTMLInputElement>instance.querySelector(".item-count-number-input")).max = item.itemCount.toString();
        (<HTMLInputElement>instance.querySelector(".item-count-number-input")).id = item.sellOrderId.toString();
        (<HTMLDivElement>instance.querySelector("#price-number")).innerHTML = item.price.toString();
        (<HTMLButtonElement>instance.querySelector("#buy-button")).value = item.sellOrderId.toString();

        document.getElementById("items-list")?.appendChild(instance);
    })
}

renderItems("", "Weapons", false, sortTypes.ASC, 10);