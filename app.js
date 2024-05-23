document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.querySelector(".overlay");
  const taskTitleInput = document.getElementById("task-title");
  const taskDescriptionInput = document.getElementById("task-description");
  const statusInputs = document.querySelectorAll('input[name="status"]');
  const formButton = document.getElementById("form-button");
  const formHeading = document.getElementById("form-heading");

  let isEditing = false;
  let currentEditingTask = null;

  const formButtons = {
    "open-todo-form": "Todo",
    "open-inprogress-form": "InProgress",
    "open-done-form": "Done",
  };

  for (const btnId in formButtons) {
    document.getElementById(btnId).addEventListener("click", () => {
      overlay.classList.remove("hidden");
      document.getElementById(
        `status-${formButtons[btnId].toLowerCase()}`
      ).checked = true;
      updateStatusColor(
        document.getElementById(`status-${formButtons[btnId].toLowerCase()}`)
      );
      formButton.textContent = "Add Task";
      formHeading.textContent = "Add Task Form";
    });
  }

  document.getElementById("close-form-btn").addEventListener("click", () => {
    overlay.classList.add("hidden");
    resetForm();
  });

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      overlay.classList.add("hidden");
      resetForm();
    }
  });

  function resetForm() {
    isEditing = false;
    currentEditingTask = null;
    taskTitleInput.value = "";
    taskDescriptionInput.value = "";
    document.getElementById("status-todo").checked = true;
    updateStatusColor(document.getElementById("status-todo"));
    formButton.textContent = "Add Task";
    formHeading.textContent = "Add Task Form";
  }

  function updateStatusColor(selectedStatus) {
    const statusOptions = document.querySelectorAll(".status-options label");
    statusOptions.forEach((option) => {
      option.classList.remove(
        "bg-red-300",
        "bg-yellow-300",
        "bg-green-300",
        "selected"
      );
    });

    let selectedLabel;
    switch (selectedStatus.value) {
      case "Todo":
        selectedLabel = document.querySelector("label[for='status-todo']");
        selectedLabel.classList.add("bg-red-300", "selected");
        break;
      case "InProgress":
        selectedLabel = document.querySelector(
          "label[for='status-inprogress']"
        );
        selectedLabel.classList.add("bg-yellow-300", "selected");
        break;
      case "Done":
        selectedLabel = document.querySelector("label[for='status-done']");
        selectedLabel.classList.add("bg-green-300", "selected");
        break;
    }
  }

  statusInputs.forEach((input) => {
    input.addEventListener("change", () => {
      updateStatusColor(input);
    });
  });

  window.addTask = function () {
    const title = taskTitleInput.value;
    const description = taskDescriptionInput.value;
    const status = document.querySelector('input[name="status"]:checked').value;

    if (isEditing && currentEditingTask) {
      updateTask(currentEditingTask, title, description, status);
    } else {
      createTask(title, description, status);
    }

    overlay.classList.add("hidden");
    resetForm();
  };

  function createTask(title, description, status) {
    const task = document.createElement("div");
    task.classList.add(
      "task",
      "bg-white",
      "rounded",
      "p-4",
      "mb-2",
      "shadow",
      "relative",
      "cursor-pointer"
    );

    const taskTitle = document.createElement("div");
    taskTitle.classList.add("font-bold", "text-lg", "mt-4");
    taskTitle.textContent = title;

    const taskDescription = document.createElement("div");
    taskDescription.classList.add(
      "text-gray-600",
      "overflow-hidden",
      "line-clamp-4"
    );
    taskDescription.textContent = description;

    task.appendChild(taskTitle);
    task.appendChild(taskDescription);

    const editIcon = document.createElement("span");
    editIcon.classList.add(
      "material-symbols-outlined",
      "absolute",
      "top-2",
      "right-10",
      "text-gray-500",
      "hover:text-gray-700",
      "cursor-pointer"
    );
    editIcon.textContent = "edit";
    editIcon.addEventListener("click", (e) => {
      e.stopPropagation();
      editTask(task, title, description, status);
    });

    const deleteIcon = document.createElement("span");
    deleteIcon.classList.add(
      "material-symbols-outlined",
      "absolute",
      "top-2",
      "right-2",
      "text-red-500",
      "hover:text-red-700",
      "cursor-pointer"
    );
    deleteIcon.textContent = "delete";
    deleteIcon.addEventListener("click", (e) => {
      e.stopPropagation();
      deleteTask(task);
    });

    task.appendChild(editIcon);
    task.appendChild(deleteIcon);

    task.addEventListener("click", () => {
      taskDescription.classList.toggle("line-clamp-4");
    });

    if (status === "Todo") {
      document.getElementById("todo-list").appendChild(task);
    } else if (status === "InProgress") {
      document.getElementById("inprogress-list").appendChild(task);
    } else if (status === "Done") {
      document.getElementById("done-list").appendChild(task);
    }

    task.dataset.title = title;
    task.dataset.description = description;
    task.dataset.status = status;

    saveTasksToLocalStorage();
  }

  function editTask(task, title, description, status) {
    isEditing = true;
    currentEditingTask = task;
    taskTitleInput.value = task.dataset.title;
    taskDescriptionInput.value = task.dataset.description;
    document.querySelector(
      `input[value="${task.dataset.status}"]`
    ).checked = true;
    updateStatusColor(
      document.querySelector(`input[value="${task.dataset.status}"]`)
    );
    overlay.classList.remove("hidden");
    formButton.textContent = "Update Task";
    formHeading.textContent = "Update Task Form";
  }

  function updateTask(task, title, description, status) {
    task.querySelector(".font-bold").textContent = title;
    task.querySelector(".text-gray-600").textContent = description;

    task.dataset.title = title;
    task.dataset.description = description;
    task.dataset.status = status;

    const currentList = task.parentElement;
    if (status === "Todo" && currentList.id !== "todo-list") {
      document.getElementById("todo-list").appendChild(task);
    } else if (
      status === "InProgress" &&
      currentList.id !== "inprogress-list"
    ) {
      document.getElementById("inprogress-list").appendChild(task);
    } else if (status === "Done" && currentList.id !== "done-list") {
      document.getElementById("done-list").appendChild(task);
    }

    saveTasksToLocalStorage();
  }

  function deleteTask(task) {
    const confirmDelete = confirm("Do you really want to delete this task?");
    if (confirmDelete) {
      task.remove();
      saveTasksToLocalStorage();
    }
  }

  function saveTasksToLocalStorage() {
    const tasks = [];
    document.querySelectorAll(".task").forEach((task) => {
      tasks.push({
        title: task.dataset.title,
        description: task.dataset.description,
        status: task.dataset.status,
      });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function loadTasksFromLocalStorage() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach((task) => {
      createTask(task.title, task.description, task.status);
    });
  }

  loadTasksFromLocalStorage();

  // Drag and Drop Functionality

  function allowDrop(event) {
    event.preventDefault();
  }

  function drag(event) {
    event.dataTransfer.setData("text/plain", event.target.id);
  }

  function drop(event, status) {
    event.preventDefault();
    const taskId = event.dataTransfer.getData("text/plain");
    const task = document.getElementById(taskId);
    const currentStatus = task.dataset.status;

    // Check if the task is being moved to a different status column
    if (currentStatus !== status) {
      // Remove the task from its current column
      task.remove();

      // Append the task to the new column
      document.getElementById(`${status.toLowerCase()}-list`).appendChild(task);

      // Update the task status
      task.dataset.status = status;

      // Save the changes to local storage
      saveTasksToLocalStorage();
    }
  }
});
