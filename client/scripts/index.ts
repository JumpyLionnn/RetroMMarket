let items: any;

enum sortTypes {
    ASC = "ASC",
    DESC = "DESC"
};
let sortingOrder: sortTypes = sortTypes.ASC;
let onlineSellersOnly: boolean = false;

class ItemCard extends HTMLDivElement {
    constructor() {
        super();
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
                    <input id="item-count-number-input" type="number" value="1" min="1" max="1">
                </div>
                <div id="price-number"></div>
            </div>
            <div id="buy-button-container">
                <button id="buy-button" value="" onclick="buyItem(this)">BUY NOW</button>
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

function compare(a: any, b: any) {
    if(a.price < b.price) return -1;
    if(a.price > b.price) return 1;
    return 0;
}

function compareReverse(b: any, a: any) {
    if(a.price < b.price) return -1;
    if(a.price > b.price) return 1;
    return 0;
}

function renderItems(items: any[]) {
    if(items === undefined) return;
    if(sortingOrder === sortTypes.ASC) items.sort(compare);
    else items.sort(compareReverse);

    console.log(items);
    const fragment = document.createElement("div", { is: "item-card" });

    (<HTMLDivElement>document.getElementById("items-list")).innerHTML = "";
    items?.forEach((item: any) => {
        const instance = document.importNode(fragment, true);
        (<HTMLImageElement>instance.querySelector("#item-image")).src = item.image;
        (<HTMLSpanElement>instance.querySelector("#item-name")).innerHTML = item.item;
        (<HTMLSpanElement>instance.querySelector("#category-name")).innerHTML = item.category;
        (<HTMLSpanElement>instance.querySelector("#seller-name")).innerHTML = item.retrommousername;
        (<HTMLSpanElement>instance.querySelector("#seller-status")).style.color = (item.sellerStatus === "online") ? "green" : "red";
        (<HTMLInputElement>instance.querySelector("#item-count-number-input")).max = item.amount.toString();
        (<HTMLDivElement>instance.querySelector("#price-number")).innerHTML = `${item.price.toString()}g`;
        (<HTMLButtonElement>instance.querySelector("#buy-button")).value = item.id.toString();

        document.getElementById("items-list")?.appendChild(instance);
    })
}

function changeSortingOrder(selected: any) {
    if(selected === "Low to High") {
        sortingOrder = sortTypes.ASC;
        renderItems(items);
    } else if (selected === "High to Low") {
        sortingOrder = sortTypes.DESC;
        renderItems(items);
    }
}

function searchItem(query: string) {
    const filteredItems = items.filter((item: any) => {
        return item.item.toLowerCase().includes(query); 
    });
    renderItems(filteredItems);
}

async function changeCategory(category:string) {
    items = await getSellOffers("", category, false, sortingOrder, 10);
    renderItems(items);
}

async function toggleOnlineSellersOnly() {
    onlineSellersOnly = !onlineSellersOnly;
    items = await getSellOffers("", "Weapons", onlineSellersOnly, sortingOrder, 10);
    renderItems(items);
}

async function firstRender() {
    items = await getSellOffers("", "Weapons", false, sortingOrder, 10);
    renderItems(items);
}

firstRender();



async function buyItem(e: HTMLButtonElement) {
    const id = parseInt(e.value);
    const parentDiv = e.parentNode!.parentNode;
    const amount = parseInt((<HTMLInputElement>parentDiv!.querySelector("#item-count-number-input"))!.value);
    
    const url = `/buy`;
    console.log(url);
    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            sellOfferId: id,
            amount: amount
        })
    });
    console.log(res);
    if(!res.ok) throw new Error("error")

    items = await getSellOffers("", "Weapons", false, sortTypes.ASC, 10);
    renderItems(items);
}