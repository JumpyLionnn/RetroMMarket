import { alert, dialog } from "./alert.js";

const resendVerificationEmailLink = document.getElementById("resend-verification-email-link") as HTMLAnchorElement | null;
resendVerificationEmailLink?.addEventListener("click", async (e) => {
    e.preventDefault();
    await fetch(resendVerificationEmailLink.href)
    alert("Verify Email Address", "Email has been sent.", ()=>{});
});