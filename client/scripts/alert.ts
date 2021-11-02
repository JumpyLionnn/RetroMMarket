const alertContainer = document.getElementById("alert-container") as HTMLDivElement;
const alertTitle = document.getElementById("alert-title") as HTMLHeadingElement;
const alertCloseButton = document.getElementById("alert-close-button") as HTMLButtonElement;
const alertMessage = document.getElementById("alert-message") as HTMLDivElement;

const alertButtonsContainer = document.getElementById("alert-buttons") as HTMLDivElement;
const yesAlertButton = document.getElementById("yes-alert-button") as HTMLButtonElement;
const noAlertButton = document.getElementById("no-alert-button") as HTMLButtonElement;

const okAlertButton = document.getElementById("ok-button") as HTMLButtonElement;

let active = false;
let currentCallback: null | ((result: boolean) => void) = null;

export function dialog(title: string, message: string, callback: (result: boolean) => void){
    alertTitle.innerText = title;
    alertMessage.innerText = message;
    currentCallback = callback;
    active = true;
    alertContainer.style.display = "flex";
    alertButtonsContainer.style.display = "flex";
    okAlertButton.style.display = "none";
    
}

export function alert(title: string, message: string, callback: (result: boolean) => void){
    alertTitle.innerText = title;
    alertMessage.innerText = message;
    currentCallback = callback;
    active = true;
    alertContainer.style.display = "flex";
    alertButtonsContainer.style.display = "none";
    okAlertButton.style.display = "block";
    
}

export function closeAlert(result: boolean): void {
    if(currentCallback !== null){
        currentCallback(result);
        currentCallback = null;
    }
    active = false;
    alertContainer.style.display = "none";
    
}

alertContainer.addEventListener("click", (e) => {if (e.target !== this) return; else closeAlert(false);});
alertCloseButton.addEventListener("click", () => closeAlert(false));

okAlertButton.addEventListener("click", () => closeAlert(false));

noAlertButton.addEventListener("click", () => closeAlert(false));

yesAlertButton.addEventListener("click", () => closeAlert(true));