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
    const statusOptions = document.querySelectorAll(".status-options label");
    statusOptions.forEach((option) => {
      option.classList.remove("bg-red-300", "bg-yellow-300", "bg-green-300", "selected");
    });

    let selectedLabel;
    switch (selectedStatus.value) {
      case "Todo":
        selectedLabel = document.querySelector("label[for='status-todo']");
        selectedLabel.classList.add("bg-red-300", "selected");
        break;
      case "InProgress":
        selectedLabel = document.querySelector("label[for='status-inprogress']");
        selectedLabel.classList.add("bg-yellow-300", "selected");
        break;
      case "Done":
        selectedLabel = document.querySelector("label[for='status-done']");
        selectedLabel.classList.add("bg-green-300", "selected");
        break;
    }
  }

  const statusInputs = document.querySelectorAll(".status-options input[type='radio']");
  statusInputs.forEach((input) => {
    input.addEventListener("change", () => {
      updateStatusColor(input);
    });
  });
});

function addTask() {
  const title = document.getElementById("task-title").value;
  const description = document.getElementById("task-description").value;
  const status = document.querySelector('input[name="status"]:checked').value;

  const task = `<div class="task bg-white rounded p-2 mb-2 shadow">${title}<br>${description}</div>`;

  if (status === "Todo") {
    document.getElementById("todo-list").innerHTML += task;
  } else if (status === "InProgress") {
    document.getElementById("inprogress-list").innerHTML += task;
  } else if (status === "Done") {
    document.getElementById("done-list").innerHTML += task;
  }
  document.querySelector(".overlay").classList.add("hidden");
}
