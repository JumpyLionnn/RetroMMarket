const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get("token");

const tokenInput = document.getElementById("token") as HTMLInputElement;
tokenInput.value = token as string;

const resetPasswordForm = document.getElementById("reset-password-form") as HTMLFormElement;

const password = document.getElementById("password-input") as HTMLInputElement;
const confirmPassword = document.getElementById("confirm-password-input") as HTMLInputElement;

const errorMessage = document.getElementById("error-message") as HTMLSpanElement;

resetPasswordForm.addEventListener("submit", (e) => {
    if(password.value.length < 5){
        e.preventDefault();
        errorMessage.innerText = "The password is too short.";
    }
    else if(password.value.length > 40){
        e.preventDefault();
        errorMessage.innerText = "The password is too long.";
    }
    if(password.value !== confirmPassword.value){
        e.preventDefault();
        errorMessage.innerText = "Confirm password does not match.";
    }
});