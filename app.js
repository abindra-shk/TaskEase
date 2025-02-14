document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.querySelector(".overlay");
  const taskTitleInput = document.getElementById("task-title");
  const taskDescriptionInput = document.getElementById("task-description");
  const statusInputs = document.querySelectorAll('input[name="status"]');
  const formButton = document.getElementById("form-button");
  const formHeading = document.getElementById("form-heading");
  const searchInput = document.getElementById("search-input");

  let isEditing = false;
  let currentEditingTask = null;

  // Add event listener for search input
  searchInput.addEventListener("input", filterTasks);

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
      case "todo":
        selectedLabel = document.querySelector("label[for='status-todo']");
        selectedLabel.classList.add("bg-red-300", "selected");
        break;
      case "inprogress":
        selectedLabel = document.querySelector(
          "label[for='status-inprogress']"
        );
        selectedLabel.classList.add("bg-yellow-300", "selected");
        break;
      case "done":
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
    const id =
      isEditing && currentEditingTask
        ? currentEditingTask.id
        : "task-" + Date.now();
    const title = taskTitleInput.value;
    const description = taskDescriptionInput.value;
    const status = document.querySelector('input[name="status"]:checked').value;

    if (isEditing && currentEditingTask) {
      updateTask(currentEditingTask, title, description, status);
    } else {
      createTask(id, title, description, status);
    }

    overlay.classList.add("hidden");
    resetForm();
  };

  function createTask(id, title, description, status) {
    const task = document.createElement("div");
    task.id = id;
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
    task.setAttribute("draggable", "true");
    task.addEventListener("dragstart", dragStart);
    task.addEventListener("dragend", dragEnd);

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

    if (status === "todo") {
      document.getElementById("todo-list").appendChild(task);
    } else if (status === "inprogress") {
      document.getElementById("inprogress-list").appendChild(task);
    } else if (status === "done") {
      document.getElementById("done-list").appendChild(task);
    }

    task.dataset.id = id;
    task.dataset.title = title;
    task.dataset.description = description;
    task.dataset.status = status;

    saveTasksToLocalStorage();
    updateTaskCount();
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
    if (status === "todo" && currentList.id !== "todo-list") {
      document.getElementById("todo-list").appendChild(task);
    } else if (
      status === "inprogress" &&
      currentList.id !== "inprogress-list"
    ) {
      document.getElementById("inprogress-list").appendChild(task);
    } else if (status === "done" && currentList.id !== "done-list") {
      document.getElementById("done-list").appendChild(task);
    }

    saveTasksToLocalStorage();
    updateTaskCount();
  }

  function deleteTask(task) {
    const confirmDelete = confirm("Do you really want to delete this task?");
    if (confirmDelete) {
      task.remove();
      saveTasksToLocalStorage();
      updateTaskCount();
    }
  }

  function saveTasksToLocalStorage() {
    const tasks = [];
    document.querySelectorAll(".task").forEach((task) => {
      tasks.push({
        id: task.dataset.id,
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
      createTask(task.id, task.title, task.description, task.status);
    });
  }

  function updateTaskCount() {
    const todoCount = document.getElementById("todo-list").childElementCount;
    const inprogressCount =
      document.getElementById("inprogress-list").childElementCount;
    const doneCount = document.getElementById("done-list").childElementCount;

    document.getElementById("todo-count").textContent = `${todoCount}`;
    document.getElementById(
      "inprogress-count"
    ).textContent = `${inprogressCount}`;
    document.getElementById("done-count").textContent = `${doneCount}`;
  }

  function highlightColumn(columnId, action) {
    const targetColumn = document.getElementById(columnId);
    if (targetColumn) {
      switch (columnId) {
        case "todo-column":
          if (action === "add") {
            targetColumn.classList.add("bg-red-200");
          } else {
            targetColumn.classList.remove("bg-red-200");
          }
          break;
        case "inprogress-column":
          if (action === "add") {
            targetColumn.classList.add("bg-yellow-200");
          } else {
            targetColumn.classList.remove("bg-yellow-200");
          }
          break;
        case "done-column":
          if (action === "add") {
            targetColumn.classList.add("bg-green-200");
          } else {
            targetColumn.classList.remove("bg-green-200");
          }
          break;
        default:
          break;
      }
    }
  }

  function allowDrop(event) {
    event.preventDefault();
    const columnId = event.target.closest(".task-column").id;
    highlightColumn(columnId, "add");
  }

  function dragEnter(event) {
    event.preventDefault();
    const columnId = event.target.closest(".task-column").id;
    highlightColumn(columnId, "add");
  }

  function dragLeave(event) {
    const relatedTargetColumn = event.relatedTarget.closest(".task-column");
    if (!relatedTargetColumn) {
      const columnId = event.target.closest(".task-column").id;
      highlightColumn(columnId, "remove");
    }
  }

  function drop(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData("text/plain");
    const task = document.getElementById(data);
    const targetColumn = event.target.closest(".task-column");
    if (targetColumn) {
      const newStatus = targetColumn.id.split("-")[0]; // "todo-column" => "todo"
      const targetList = targetColumn.querySelector(".tasks-list");
      if (targetList) {
        targetList.appendChild(task);
        updateTaskStatus(task, newStatus);
        highlightColumn(targetColumn.id, "remove");
      }
    }
  }

  function dragStart(event) {
    event.dataTransfer.setData("text/plain", event.target.id);
    event.dataTransfer.effectAllowed = "move";
    setTimeout(() => {
      event.target.classList.add("hide");
    }, 0);
  }

  function dragEnd(event) {
    event.target.classList.remove("hide");
    updateTaskCount();
  }

  function updateTaskStatus(task, newStatus) {
    task.dataset.status = newStatus;
    saveTasksToLocalStorage();
  }

  function filterTasks() {
    const query = searchInput.value.toLowerCase();
    const tasks = document.querySelectorAll(".task");
    tasks.forEach((task) => {
      const title = task.dataset.title.toLowerCase();
      const description = task.dataset.description.toLowerCase();
      if (title.includes(query) || description.includes(query)) {
        task.style.display = "";
      } else {
        task.style.display = "none";
      }
    });
  }

  document.querySelectorAll(".task-column").forEach((column) => {
    column.addEventListener("dragenter", dragEnter);
    column.addEventListener("dragleave", dragLeave);
    column.addEventListener("dragover", allowDrop);
    column.addEventListener("drop", drop);
  });

  loadTasksFromLocalStorage();
});
