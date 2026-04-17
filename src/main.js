const hardTitle = document.getElementById("hardTitle");
const hardDesc = document.getElementById("todo-desc");

let dueDate = new Date("2026-04-16T23:59:00Z");
const timeEl = document.querySelector(
    '[data-testid="test-todo-time-remaining"]',
);
let dueDateSlot = document.getElementById("due-date");
const card = document.querySelector('[data-testid="test-todo-card"]');
const statusEl = document.querySelector('[data-testid="test-todo-status"]');
const statusControl = document.getElementById("status-control");
const checkbox = document.getElementById("todo-toggle");
const priority = document.querySelector("[data-testid='priority']");
const article = document.querySelector('[data-testid="test-todo-card"]');
const editForm = document.querySelector(".edit-form");
const priorityItems = ["high", "low", "medium"];
const showmorebtn = document.getElementById("toggle-btn");
const container = document.getElementById("collapsible-desc");

const overdueIndicator = document.querySelector(
    '[data-testid="test-todo-overdue-indicator"]',
);

// Form inputs
const titleInput = document.getElementById("title-input");
const descriptionInput = document.getElementById("textarea-input");
const priorityInput = document.getElementById("priority-input");
const dueDateInput = document.getElementById("due-date-input");

let isComplete = false;

// Master sync function - keeps checkbox, status display, and status control in sync
function syncStatus(source) {
    if (source === "checkbox") {
        isComplete = checkbox.checked;
        const newStatus = isComplete ? "done" : "in progress";
        statusControl.value = newStatus;
    } else if (source === "control") {
        const selectedStatus = statusControl.value;
        isComplete = selectedStatus === "done";
        checkbox.checked = isComplete;
    }

    // Update status display
    if (isComplete) {
        statusEl.textContent = "Done";
        statusEl.className = "status-done";
        statusEl.setAttribute("aria-label", "Status: Done");
        card.classList.add("done");
    } else {
        statusEl.textContent = "In Progress";
        statusEl.className = "status-inprogress";
        statusEl.setAttribute("aria-label", "Status: In Progress");
        card.classList.remove("done");
    }

    updateTime();
}

function saveEdit() {
    const newTitle = titleInput.value.trim();
    hardTitle.textContent = newTitle;

    const newDesc = descriptionInput.value.trim();
    hardDesc.textContent = newDesc;

    const rawDate = dueDateInput.value;

    dueDate = new Date(rawDate + "T23:59:00Z");
    updateTime();
    console.log(rawDate);
    cancelEdit();

    // editForm.reset();
}

if (hardDesc.innerText.length > 90) {
    showmorebtn.style.visibility = "visible";
    container.classList.add("collapsed");
} else {
    showmorebtn.style.visibility = "hidden";
    console.log("not enough");
}
showmorebtn.addEventListener("click", () => {
    const isExpanded = showmorebtn.getAttribute("aria-expanded") === "true";

    if (isExpanded) {
        container.classList.add("collapsed");
        showmorebtn.setAttribute("aria-expanded", "false");
        showmorebtn.textContent = "Show more";
    } else {
        container.classList.remove("collapsed");
        showmorebtn.setAttribute("aria-expanded", "true");
        showmorebtn.textContent = "Show less";
    }
});

function updateTime() {
    const now = new Date();
    const diff = dueDate - now;
    const abs = Math.abs(diff);
    const mins = Math.floor(abs / 60000);
    const hours = Math.floor(abs / 3600000);
    const days = Math.floor(abs / 86400000);

    let text, cls;
    if (isComplete) {
        cls = "complete";
        text = "completed";
    } else if (diff < 0) {
        article.style.borderColor = "red";

        cls = "time-overdue";
        text =
            mins < 60
                ? `Overdue by ${mins}m`
                : hours < 24
                  ? `Overdue by ${hours}h`
                  : `Overdue by ${days}d`;
    } else if (diff < 60000) {
        text = "Due now!";
        cls = "time-soon";
    } else if (diff < 86400000) {
        cls = "time-soon";
        text = hours < 1 ? `Due in ${mins}m` : `Due in ${hours}h`;
    } else if (days === 1) {
        text = "Due tomorrow";
        cls = "time-ok";
    } else {
        text = `Due in ${days} days`;
        cls = "time-ok";
    }

    if (diff < 0) {
        overdueIndicator.style.visibility = "visible";
    } else {
        overdueIndicator.style.visibility = "hidden";
    }

    timeEl.textContent = text;
    timeEl.className = cls;
    const latestDate = dueDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
    dueDateSlot.textContent = latestDate;
    console.log(`frmat: ${latestDate}`);
}

const editMode = () => {
    editForm.style.visibility = "visible";
};
const cancelEdit = () => {
    editForm.style.visibility = "hidden";
};
updateTime();
setInterval(updateTime, 60000);

// checkbox.addEventListener("change", () => {
//     if (checkbox.checked) {
//         isComplete = true;
//         card.classList.add("done");
//         statusEl.textContent = "Done";
//         statusEl.className = "status-done";
//         statusEl.setAttribute("aria-label", "Status: Done");
//     } else {
//         isComplete = false;
//         card.classList.remove("done");
//         statusEl.textContent = "pending";
//         statusEl.className = "status-pending";
//         statusEl.setAttribute("aria-label", "Status: Pending");
//     }

//     updateTime();
// });
let control = "in progress"; // default

function updateUI() {
    // Sync checkbox
    checkbox.checked = control === "done";

    // Sync statusControl
    statusControl.value = status;

    // Update UI
    if (control === "done") {
        card.classList.add("done");
        statusEl.textContent = "Done";
        statusEl.className = "status-done";
        statusEl.setAttribute("aria-label", "Status: Done");
    } else if (control === "pending") {
        card.classList.remove("done");
        statusEl.textContent = "Pending";
        statusEl.className = "status-pending";
        statusEl.setAttribute("aria-label", "Status: Pending");
    } else {
        card.classList.remove("done");
        statusEl.textContent = "In Progress";
        statusEl.className = "status-inprogress";
        statusEl.setAttribute("aria-label", "Status: In Progress");
    }
}
checkbox.addEventListener("change", () => {
    if (checkbox.checked) {
        control = "done";
    } else {
        control = "pending"; // your rule
    }

    updateUI();
});

// const dropdown = document.getElementById("status-control");

statusControl.addEventListener("change", () => {
    control = statusControl.value;
    updateUI();
});
