const RetroMMOUsernameEditButton = document.getElementById("RetroMMO-username-edit-button") as HTMLButtonElement;
const RetroMMOUsernameEditInput = document.getElementById("RetroMMO-username-edit-input") as HTMLInputElement;
let RetroMMOUsernameEditMode = false;
RetroMMOUsernameEditButton.style.backgroundImage = `url("assets/editIcon.png")`;
RetroMMOUsernameEditButton.addEventListener("click", () =>{
    if(RetroMMOUsernameEditMode){
        RetroMMOUsernameEditButton.style.backgroundImage = `url("assets/editIcon.png")`;
        RetroMMOUsernameEditInput.disabled = true;
        fetch("/changeRetroMMOUsername", {
            method: "POST",
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify({RetroMMOUsername: RetroMMOUsernameEditInput.value})
        });
        RetroMMOUsernameEditMode = false;
    }
    else{
        RetroMMOUsernameEditButton.style.backgroundImage = `url("assets/doneIcon.png")`;
        RetroMMOUsernameEditInput.disabled = false;
        RetroMMOUsernameEditMode = true;
    }
    
});



const discordNameEditButton = document.getElementById("discord-name-edit-button") as HTMLButtonElement;
const discordNameEditInput = document.getElementById("discord-name-edit-input") as HTMLInputElement;
let discordNameEditMode = false;
discordNameEditButton.style.backgroundImage = `url("assets/editIcon.png")`;
discordNameEditButton.addEventListener("click", () =>{
    if(discordNameEditMode){
        if(!/^\S+#\d{4}$/.test(discordNameEditInput.value)){
            return;
        }
        discordNameEditButton.style.backgroundImage = `url("assets/editIcon.png")`;
        discordNameEditInput.disabled = true;
        fetch("/changeDiscordName", {
            method: "POST",
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify({discordName: discordNameEditInput.value})
        });
        discordNameEditMode = false;
    }
    else{
        discordNameEditButton.style.backgroundImage = `url("assets/doneIcon.png")`;
        discordNameEditInput.disabled = false;
        discordNameEditMode = true;
    }
    
});