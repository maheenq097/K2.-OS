// theme.js

window.addEventListener("DOMContentLoaded", () => {

    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark-theme");
    } else {
        document.body.classList.remove("dark-theme");
    }

    if (localStorage.getItem("largeText") === "true") {
        document.body.classList.add("large-text");
    } else {
        document.body.classList.remove("large-text");
    }

});