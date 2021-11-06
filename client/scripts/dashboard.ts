import { alert, dialog } from "./alert.js";

const activeUsersTd = document.getElementById("active-users") as HTMLTableCellElement;
const activeSellOffersTd = document.getElementById("active-sell-offers") as HTMLTableCellElement;
const activeBuyOrdersTd = document.getElementById("active-buy-orders") as HTMLTableCellElement;
const activeTotalRowsTd = document.getElementById("active-total-rows") as HTMLTableCellElement;

const usersTd = document.getElementById("users") as HTMLTableCellElement;
const sellOffersTd = document.getElementById("sell-offers") as HTMLTableCellElement;
const buyOrdersTd = document.getElementById("buy-orders") as HTMLTableCellElement;
const totalRowsTd = document.getElementById("total-rows") as HTMLTableCellElement;

const requestsSpan = document.getElementById("requests") as HTMLSpanElement;

const nameInput = document.getElementById("name-input") as HTMLInputElement;
const confrimNameInput = document.getElementById("confirm-name-input") as HTMLInputElement;

setInterval(update, 1000 * 60 * 5);


async function update(){
    const rows = await (await fetch("/rows")).json();
    activeUsersTd.innerText = rows.activeUsers;
    activeSellOffersTd.innerText = rows.activeSellOffers;
    activeBuyOrdersTd.innerText = rows.activeBuyOrders;
    activeTotalRowsTd.innerText = rows.activeTotal;

    usersTd.innerText = rows.users;
    sellOffersTd.innerText = rows.sellOffers;
    buyOrdersTd.innerText = rows.buyOrders;
    totalRowsTd.innerText = rows.total;


    const requests = await (await fetch("/requests")).json();
    requestsSpan.innerText = requests.requests;
}

update();

function checkName(): string | boolean {
    const name = nameInput.value;
    const confrimName = confrimNameInput.value;
    if(name === confrimName) {
        return name;
    }
    alert("", "The names entered are not the same", () => {});
    return false;
}

(document.getElementById("ban-button") as HTMLButtonElement).addEventListener("click", () => {
    const name = checkName();
    if(name){
        dialog("ban", `are you sure you want to <span class="red">ban</span> the user with the name of <span class="red">${name}</span>`, async (result) => {
            if(result){
                const res = await fetch("/ban", { 
                    method: "POST", 
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({name})
                });

                if(res.ok){
                    alert("Banned successfully", `You successfully banned ${name}`, () => {});
                }
                else{ 
                    alert("Banned faild", await res.text(), () => {});
                }
            }
        });
        nameInput.value = "";
        confrimNameInput.value = "";
    }
});

(document.getElementById("unban-button") as HTMLButtonElement).addEventListener("click", () => {
    const name = checkName();
    if(name){
        dialog("unban", `are you sure you want to <span class="red">unban</span> the user with the name of <span class="red">${name}</span>`, async (result) => {
            if(result){
                const res = await fetch("/unban", { 
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({name})
                });

                if(res.ok){
                    alert("Unbanned successfully", `You successfully unbanned ${name}`, () => {});
                }
                else{ 
                    alert("Unbanned faild", await res.text(), () => {});
                }
            }
        });
        nameInput.value = "";
        confrimNameInput.value = "";
    }
});

(document.getElementById("delete-button") as HTMLButtonElement).addEventListener("click", () => {
    const name = checkName();
    if(name){
        dialog("delete", `are you sure you want to <span class="red">delete</span> the user with the name of <span class="red">${name}</span>`, async (result) => {
            if(result){
                const res = await fetch("/delete", { 
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({name})
                });

                if(res.ok){
                    alert("Deleted successfully", `You successfully deleted ${name}`, () => {});
                }
                else{ 
                    alert("Deleted faild", await res.text(), () => {});
                }
            }
        });
        nameInput.value = "";
        confrimNameInput.value = "";
    }
});