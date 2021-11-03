import { dialog, alert } from "./alert.js";

let items: any;
let itemsExtraData: any;

let sortBy: string = "price";
let ascending: boolean = false;

let onlineSellersOnly: boolean = false;
let currentCategory: string = "";
let upperLimit: number = 10;

let query: string = "";

window.onscroll = async function() {
    if((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight) {
        upperLimit += 10;
        await updateItems();
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

function getItemWikiLink(query: string) {
    const item = itemsExtraData[query];
    if(item !== undefined)
        return item.wiki;
    return "";
}

class ItemCard extends HTMLDivElement {
    constructor() {
        super();
        this.innerHTML = `
        <div id="item-card">
            <div id="item-preview">
                <img id="item-image" src="" alt="">
                <a id="item-name-link" target="_blank">
                    <span id="item-name"></span>
                    <img id="external-link-image" src="assets/externalLink.png" alt="">
                </a>
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

async function getSellOffers(query: string, category: string, onlineSellersOnly: boolean, sortBy: string, ascending: boolean, upperLimit: number) {
    const url = `/find?query=${query}${category !== "" ? "&category=" + category : ""}&onlineSellersOnly=${onlineSellersOnly}&sortBy=${sortBy}&ascending=${ascending}&to=${upperLimit}`;
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

function renderItems(items: any[]) {
    if(items === undefined || items.length === 0) {
        displayErrorMessage("No items found with the current search parameters.")
        return;
    };

    const fragment = document.createElement("div", { is: "item-card" });

    (<HTMLDivElement>document.getElementById("items-list")).innerHTML = "";
    items?.forEach((item: any) => {
        const instance = document.importNode(fragment, true);
        (<HTMLImageElement>instance.querySelector("#item-image")).src = `assets/${getItemImage(item.item)}`;
        (<HTMLAnchorElement>instance.querySelector("#item-name")).innerHTML = item.item;
        (<HTMLAnchorElement>instance.querySelector("#item-name-link")).href = getItemWikiLink(item.item);
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

async function updateItems(){
    items = await getSellOffers(query, currentCategory, onlineSellersOnly, sortBy, ascending, upperLimit);
    renderItems(items);
}

function changeSortingOrder(selected: string) {
    if(selected === "priceASC"){
        ascending = true;
        sortBy = "price";
    }
    else if(selected === "priceDESC"){
        ascending = false;
        sortBy = "price";
    }
    else if(selected === "dateASC"){
        ascending = true;
        sortBy = "date";
    }
    else if(selected === "dateDESC"){
        ascending = false;
        sortBy = "date";
    }
    updateItems();
}

async function searchItem(searchValue: string) {
    query = searchValue;
    updateItems();
}

async function changeCategory(category:string) {
    upperLimit = 10;
    currentCategory = category;
    updateItems();
}

async function toggleOnlineSellersOnly() {
    onlineSellersOnly = !onlineSellersOnly;
    updateItems();
}

async function firstRender() {
    itemsExtraData = await getExtraItemData();
    updateItems();
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
    if(!res.ok){
        alert("error", await res.text(), () => {});
        return;
    }

    updateItems();
    dialog("", "Do you want to view your orders?", (result: boolean) => {
        if(result) {
            window.location.replace("/orders");
        }
    });
}