const dueDate = new Date("2026-04-16T23:59:00Z");
const timeEl = document.querySelector(
    '[data-testid="test-todo-time-remaining"]',
);
const card = document.querySelector('[data-testid="test-todo-card"]');
const statusEl = document.querySelector('[data-testid="test-todo-status"]');
const checkbox = document.getElementById("todo-toggle");

function updateTime() {
    const now = new Date();
    const diff = dueDate - now;
    const abs = Math.abs(diff);
    const mins = Math.floor(abs / 60000);
    const hours = Math.floor(abs / 3600000);
    const days = Math.floor(abs / 86400000);

    let text, cls;

    if (diff < 0) {
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

    timeEl.textContent = text;
    timeEl.className = cls;
}

updateTime();
setInterval(updateTime, 60000);

checkbox.addEventListener("change", () => {
    if (checkbox.checked) {
        card.classList.add("done");
        statusEl.textContent = "Done";
        statusEl.className = "status-done";
        statusEl.setAttribute("aria-label", "Status: Done");
    } else {
        card.classList.remove("done");
        statusEl.textContent = "In Progress";
        statusEl.className = "status-inprogress";
        statusEl.setAttribute("aria-label", "Status: In Progress");
    }
});
