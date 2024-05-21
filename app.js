document.addEventListener("DOMContentLoaded", () => {
  const openFormBtn = document.getElementById("open-form-btn");
  const closeFormBtn = document.getElementById("close-form-btn");
  const overlay = document.querySelector(".overlay");

  openFormBtn.addEventListener("click", () => {
    overlay.classList.remove("hidden");
  });

  closeFormBtn.addEventListener("click", () => {
    overlay.classList.add("hidden");
  });

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      overlay.classList.add("hidden");
    }
  });

  const defaultStatus = document.getElementById("status-todo");
  defaultStatus.checked = true;
  updateStatusColor(defaultStatus);

  function updateStatusColor(selectedStatus) {
    const statusOptions = document.querySelectorAll(".status-option");
    statusOptions.forEach((option) => {
      option.classList.remove("bg-red-300", "bg-yellow-300", "bg-green-300");
    });
    selectedStatus.nextElementSibling.classList.add("selected");
  }

  const statusOptions = document.querySelectorAll(".status-option");
  statusOptions.forEach((option) => {
    option.addEventListener("click", () => {
      updateStatusColor(option.previousElementSibling);
    });
  });
});

function addTask() {
  const title = document.getElementById("task-title").value;
  const description = document.getElementById("task-description").value;
  const status = document.querySelector('input[name="status"]:checked').value;

  const task = `<div class="task bg-white rounded p-2 mb-2">${title}<br>${description}</div>`;

  if (status === "Todo") {
    document.getElementById("todo-list").innerHTML += task;
  } else if (status === "InProgress") {
    document.getElementById("inprogress-list").innerHTML += task;
  } else if (status === "Done") {
    document.getElementById("done-list").innerHTML += task;
  }
  document.querySelector(".overlay").classList.add("hidden");
}
