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

  // Add event listeners to open form buttons for each column
  const openTodoFormBtn = document.getElementById("open-todo-form");
  openTodoFormBtn.addEventListener("click", () => {
    overlay.classList.remove("hidden");
    document.getElementById("status-todo").checked = true;
    updateStatusColor(document.getElementById("status-todo"));
  });

  const openInProgressFormBtn = document.getElementById("open-inprogress-form");
  openInProgressFormBtn.addEventListener("click", () => {
    overlay.classList.remove("hidden");
    document.getElementById("status-inprogress").checked = true;
    updateStatusColor(document.getElementById("status-inprogress"));
  });

  const openDoneFormBtn = document.getElementById("open-done-form");
  openDoneFormBtn.addEventListener("click", () => {
    overlay.classList.remove("hidden");
    document.getElementById("status-done").checked = true;
    updateStatusColor(document.getElementById("status-done"));
  });
});

function addTask() {
  const title = document.getElementById("task-title").value;
  const description = document.getElementById("task-description").value;
  const status = document.querySelector('input[name="status"]:checked').value;

  const task = document.createElement('div');
  task.classList.add('task', 'bg-white', 'rounded', 'p-4', 'mb-2', 'shadow', 'relative', 'cursor-pointer');

  const taskTitle = document.createElement('div');
  taskTitle.classList.add('font-bold', 'text-lg');
  taskTitle.textContent = title;

  const taskDescription = document.createElement('div');
  taskDescription.classList.add('text-gray-600', 'overflow-hidden', 'line-clamp-4');
  taskDescription.textContent = description;

  task.appendChild(taskTitle);
  task.appendChild(taskDescription);

  // Add edit icon
  const editIcon = document.createElement('span');
  editIcon.classList.add('absolute', 'top-2', 'right-2', 'text-gray-500', 'hover:text-gray-700', 'cursor-pointer');
  editIcon.innerHTML = '&#9998;'; // Unicode pencil icon
  task.appendChild(editIcon);

  task.addEventListener('click', () => {
    if (taskDescription.classList.contains('line-clamp-4')) {
      taskDescription.classList.remove('line-clamp-4');
    } else {
      taskDescription.classList.add('line-clamp-4');
    }
  });

  // Append the task to the appropriate task list based on status
  if (status === 'Todo') {
    document.getElementById('todo-list').appendChild(task);
  } else if (status === 'InProgress') {
    document.getElementById('inprogress-list').appendChild(task);
  } else if (status === 'Done') {
    document.getElementById('done-list').appendChild(task);
  }

  // Hide the form and reset input fields after adding the task
  document.querySelector('.overlay').classList.add('hidden');
  document.getElementById('task-title').value = '';
  document.getElementById('task-description').value = '';
}
