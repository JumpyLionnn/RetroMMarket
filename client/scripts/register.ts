const passwordInput = document.getElementById("password-input") as HTMLInputElement;
const confirmPasswordInput = document.getElementById("confirm-password-input") as HTMLInputElement;

const errorMessageSpan = document.getElementById("error-message") as HTMLSpanElement;
 
(document.getElementById("register-form") as HTMLFormElement).addEventListener("submit", (e) => {
    if(passwordInput.value !== confirmPasswordInput.value){
        e.preventDefault();
        errorMessageSpan.innerText = "Confirm password does not match.";
    }
}); 