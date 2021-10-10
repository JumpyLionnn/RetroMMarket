const searchButton = document.getElementById("submit-search-button") as HTMLButtonElement;
searchButton.addEventListener("click", submitSearch);
const searchInput = document.getElementById("search-input") as HTMLInputElement;
searchInput.addEventListener("search", submitSearch);




function submitSearch(){
    console.log("search subimtted");
}