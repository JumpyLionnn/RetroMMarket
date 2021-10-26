import { displayAlert } from "./alert.js";

let items: any;
let itemsExtraData: any;

enum sortTypes {
    ASC = "ASC",
    DESC = "DESC"
};
let sortingOrder: sortTypes = sortTypes.ASC;
let onlineSellersOnly: boolean = false;
let currentCategory: string = "";
let upperLimit: number = 10;

window.onscroll = async function(ev) {
    if((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight) {
        upperLimit += 10;
        items = await getSellOffers("", currentCategory, onlineSellersOnly, sortingOrder, upperLimit);
        renderItems(items);
        if(items.length > upperLimit) upperLimit = items.length;
    }
}

const allCategoryInput = document.querySelector("input#all") as HTMLInputElement;
allCategoryInput.addEventListener("click", (e) => changeCategory(""));

const armorsCategoryInput = document.querySelector("input#armors") as HTMLInputElement;
armorsCategoryInput.addEventListener("click", (e) => changeCategory(armorsCategoryInput.value));

const consumablesCategoryInput = document.querySelector("input#consumables") as HTMLInputElement;
consumablesCategoryInput.addEventListener("click", (e) => changeCategory(consumablesCategoryInput.value));

const cosmeticsCategoryInput = document.querySelector("input#cosmetics") as HTMLInputElement;
cosmeticsCategoryInput.addEventListener("click", (e) => changeCategory(cosmeticsCategoryInput.value));

const weaponsCategoryInput = document.querySelector("input#weapons") as HTMLInputElement;
weaponsCategoryInput.addEventListener("click", (e) => changeCategory(weaponsCategoryInput.value));

const toggleOnlineSellersOnlyInput = document.getElementById("toggleOnlineSellersOnly") as HTMLInputElement;
toggleOnlineSellersOnlyInput.addEventListener("click", (e) => toggleOnlineSellersOnly());

const searchInput = document.getElementById("search-input") as HTMLInputElement;
searchInput.addEventListener("change", (e) => searchItem(searchInput.value));

const orderSelector = document.getElementById("order-selector") as HTMLSelectElement;
orderSelector.addEventListener("change", (e) => changeSortingOrder(orderSelector.value));

async function getExtraItemData() {
    const url = "/items";
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

function getItemImage(query: string) {
    const item = itemsExtraData[query];
    if(item !== undefined)
        return item.image;
    return "";
}

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
                <button id="buy-button" value="">BUY NOW</button>
            </div>
        </div>
        `;
    }
}

customElements.define("item-card", ItemCard, { extends: "div" });

function displayErrorMessage(message: string) {
    const itemsList = document.getElementById("items-list") as HTMLDivElement;
    const errorLabel = document.createElement("span");
    errorLabel.id = "item-list-message";
    errorLabel.innerHTML = message;
    errorLabel.style.display = "block";
    itemsList.innerHTML = "";
    itemsList.appendChild(errorLabel);
}

async function getSellOffers(query: string, category: string, onlineSellersOnly: boolean, sortBy: sortTypes, upperLimit: number) {
    const url = `/find?query=${query}${category !== "" ? "&category=" + category : ""}&onlineSellersOnly=${onlineSellersOnly}&sort=${sortBy}&to=${upperLimit}`;
    const res = await fetch(url, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        }
    });

    if(!res.ok) displayErrorMessage("No items found with the current search parameters.")

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
    if(items === undefined || items.length === 0) {
        displayErrorMessage("No items found with the current search parameters.")
        return;
    };
    if(sortingOrder === sortTypes.ASC) items.sort(compare);
    else items.sort(compareReverse);

    const fragment = document.createElement("div", { is: "item-card" });

    (<HTMLDivElement>document.getElementById("items-list")).innerHTML = "";
    items?.forEach((item: any) => {
        const instance = document.importNode(fragment, true);
        (<HTMLImageElement>instance.querySelector("#item-image")).src = `assets/${getItemImage(item.item)}`;
        (<HTMLSpanElement>instance.querySelector("#item-name")).innerHTML = item.item;
        (<HTMLSpanElement>instance.querySelector("#category-name")).innerHTML = item.category;
        (<HTMLSpanElement>instance.querySelector("#seller-name")).innerHTML = item.retrommousername;
        (<HTMLSpanElement>instance.querySelector("#seller-status")).style.color = (item.sellerStatus === "online") ? "green" : "red";
        (<HTMLInputElement>instance.querySelector("#item-count-number-input")).max = item.amount.toString();
        (<HTMLDivElement>instance.querySelector("#price-number")).innerHTML = `${item.price.toString()}g`;
        const button = <HTMLButtonElement>instance.querySelector("#buy-button");
        button.value = item.id.toString();
        button.addEventListener("click", () => { buyItem(button); })

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
    upperLimit = 10;
    currentCategory = category;
    items = await getSellOffers("", currentCategory, onlineSellersOnly, sortingOrder, upperLimit);
    renderItems(items);
}

async function toggleOnlineSellersOnly() {
    onlineSellersOnly = !onlineSellersOnly;
    items = await getSellOffers("", currentCategory, onlineSellersOnly, sortingOrder, upperLimit);
    renderItems(items);
}

async function firstRender() {
    itemsExtraData = await getExtraItemData();
    items = await getSellOffers("", currentCategory, onlineSellersOnly, sortingOrder, upperLimit);
    renderItems(items);
}

firstRender();



async function buyItem(e: HTMLButtonElement) {
    const id = parseInt(e.value);
    const parentDiv = e.parentNode!.parentNode;
    const amount = parseInt((<HTMLInputElement>parentDiv!.querySelector("#item-count-number-input"))!.value);
    
    const url = `/buy`;
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
    if(!res.ok) throw new Error(await res.text())

    items = await getSellOffers("", currentCategory, onlineSellersOnly, sortTypes.ASC, upperLimit);
    renderItems(items);
    displayAlert("", "Do you want to view your orders?", (result: boolean) => {
        if(result) {
            window.location.replace("/orders");
        }
    });
}