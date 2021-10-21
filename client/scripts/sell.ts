
const itemMenuElementCard = document.getElementById("item-menu-element-card") as HTMLDivElement;

const closeItemMenuButton = document.getElementById("close-item-menu") as HTMLButtonElement;
closeItemMenuButton.addEventListener("click", () =>{
    itemMenuElementCard.style.display = "none";
});

const itemSearchInput = document.getElementById("item-search-input") as HTMLInputElement;

const sellForm = document.getElementById("sell-form") as HTMLFormElement;

const selectedItemCard = document.getElementById("selected-item-card") as HTMLDivElement;
selectedItemCard.addEventListener("click", () => {
    itemMenuElementCard.style.display = "flex";
});

const selectedItemCardImage = document.getElementById("selected-item-card-image") as HTMLImageElement;
const currentItemName = document.getElementById("current-item-name") as HTMLHeadingElement;

let currentItem = document.getElementById("current-item-name-field") as HTMLInputElement;

class ItemCard extends HTMLDivElement {
    constructor() {
        super();
        this.innerHTML = `
        <img id="item-option-card-image" src="" alt="">
        <h2 id="item-option-card-name"></h2>
        `;
        this.id = "item-option-card";
    }
}

const itemList = document.getElementById("item-menu-list") as HTMLDivElement;

customElements.define("item-card", ItemCard, { extends: "div" });


fetch("/items").then(async (res: Response) => {
    const items = await res.json();
    const keys = Object.keys(items);

    const fragment = document.createElement("div", { is: "item-card" });
    itemList.innerHTML = "";
    keys.forEach((itemName: string) => {
        const instance = document.importNode(fragment, true);
        instance.dataset.name = itemName;
        (<HTMLImageElement>instance.querySelector("#item-option-card-image")).src = "assets/" + items[itemName].image;
        (<HTMLSpanElement>instance.querySelector("#item-option-card-name")).innerText = itemName;
        instance.addEventListener("click", () => {
            itemMenuElementCard.style.display = "none";
            currentItem.value = itemName;
            selectedItemCardImage.src = "assets/" + items[itemName].image;
            currentItemName.innerText = itemName;
        });
        itemList.appendChild(instance);
    })
});

itemSearchInput.addEventListener("input", () => {
    const value = itemSearchInput.value.toLowerCase();
    (itemList.childNodes as NodeListOf<HTMLDivElement>).forEach((itemCard: HTMLDivElement) => {
        if(itemCard.dataset.name?.toLowerCase().includes(value)){
            itemCard.style.display = "flex";
        }
        else{
            itemCard.style.display = "none";
        }
    });
});

sellForm.addEventListener("submit", (e) => {
    if(currentItem.value === ""){
        e.preventDefault();
    }
});

export {}


