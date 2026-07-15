const updateBtn = document.getElementById("refreshBtn");

updateBtn.addEventListener("click", function () {

    let completed = prompt("Enter Completed Tasks:", document.getElementById("completed").textContent);
    let pending = prompt("Enter Pending Tasks:", document.getElementById("pending").textContent);
    let productivity = prompt("Enter Weekly Productivity (%):", document.getElementById("productivity").textContent.replace("%",""));
    let mood = prompt("Enter Current Mood:", document.getElementById("mood").textContent);
    let journal = prompt("Enter Journal Entries This Week:", document.getElementById("journal").textContent.match(/\d+/)[0]);

    if (completed !== null && completed !== "") {
        document.getElementById("completed").textContent = completed;
    }

    if (pending !== null && pending !== "") {
        document.getElementById("pending").textContent = pending;
    }

    if (productivity !== null && productivity !== "") {
        document.getElementById("productivity").textContent = productivity + "%";
    }

    if (mood !== null && mood !== "") {
        document.getElementById("mood").textContent = mood;
    }

    if (journal !== null && journal !== "") {
        document.getElementById("journal").textContent = journal + " Entries This Week";
    }

    alert("Analytics Updated Successfully!");
});
const theme = localStorage.getItem("theme");

if (theme === "dark") {
    document.body.classList.add("dark-theme");
}