document.addEventListener("DOMContentLoaded", () => {
  const openFormBtn = document.getElementById("open-form-btn");
  const closeFormBtn = document.getElementById("close-form-btn");
  const overlay = document.getElementById("overlay");

  openFormBtn.addEventListener("click", () => {
    overlay.style.display = "flex";
  });

  closeFormBtn.addEventListener("click", () => {
    overlay.style.display = "none";
  });

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      overlay.style.display = "none";
    }
  });
});

function addTask() {
  // Your existing addTask logic here

  // Close the form after adding the task
  document.getElementById("overlay").style.display = "none";
}
