window.addEventListener("DOMContentLoaded", () => {
    loadSettings();
    applyTheme();
});

document.getElementById("saveSettings").addEventListener("click", saveSettings);

function saveSettings() {

    
    const darkMode = document.getElementById("darkMode").checked;
    const notifications = document.getElementById("notifications").checked;
    const language = document.getElementById("language").value;
    const largeText = document.getElementById("largeText").checked;
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();

    
    localStorage.setItem("theme", darkMode ? "dark" : "light");
    localStorage.setItem("notifications", notifications);
    localStorage.setItem("username", username);
    localStorage.setItem("email", email);
    localStorage.setItem("language",language);
    localStorage.setItem("largeText",largeText);

    applyTheme();
if (localStorage.getItem("largeText") === "true") {
    document.body.classList.add("large-text");
} else {
    document.body.classList.remove("large-text");
}
    alert("Settings Saved Successfully!");
}

function loadSettings() {

    document.getElementById("darkMode").checked =
        localStorage.getItem("theme") === "dark";

    document.getElementById("notifications").checked =
        localStorage.getItem("notifications") === "true";

    document.getElementById("username").value =
        localStorage.getItem("username") || "";

    document.getElementById("email").value =
        localStorage.getItem("email") || "";
        document.getElementById("language").value =
    localStorage.getItem("language") || "en";

document.getElementById("largeText").checked =
    localStorage.getItem("largeText") === "true";
}

function applyTheme() {

    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark-theme");
    } else {
        document.body.classList.remove("dark-theme");
    }
}

// Theme updates automatically if changed
window.addEventListener("storage", function () {
    applyTheme();
});
const theme = localStorage.getItem("theme");

if (theme === "dark") {
    document.body.classList.add("dark-theme");
}