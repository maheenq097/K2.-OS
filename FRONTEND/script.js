const editBtn = document.getElementById("editBtn");

editBtn.addEventListener("click", function () {

    let newName = prompt("Enter your name:");
    let newUsername = prompt("Enter your username (without @):");

    if (newName !== null && newName.trim() !== "") {
        document.getElementById("profileName").textContent = newName;
    }

    if (newUsername !== null && newUsername.trim() !== "") {
        document.getElementById("userName").textContent = "@" + newUsername;
    }

    if (newName !== null && newName.trim() !== "") {
        alert("Welcome to " + newName + "'s Profile!");
    }
    if (localStorage.getItem("darkTheme") === "true") {
    document.body.classList.add("dark-mode");
}


if (localStorage.getItem("accessibility") === "Large Text") {
    document.body.style.fontSize = "20px";
}
const theme = localStorage.getItem("theme");

if (theme === "dark") {
    document.body.classList.add("dark-theme");
}ss

});