// ==========================
// ELEMENTS
// ==========================
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const filterButtons = document.querySelectorAll(".filters button");
const toggleThemeBtn = document.getElementById("toggleTheme");
const taskCounter = document.getElementById("taskCounter");
const emptyState = document.getElementById("emptyState");

// ==========================
// STATE
// ==========================
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

// ==========================
// SAVE
// ==========================
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ==========================
// CREATE TASK
// ==========================
function createTaskElement(task, index) {
  const li = document.createElement("li");

  const span = document.createElement("span");
  span.textContent = task.text;
  span.className = task.completed ? "task-text completed" : "task-text";

  const actions = document.createElement("div");
  actions.className = "task-actions";

  const checkBtn = document.createElement("button");
  checkBtn.innerHTML = "✔";
  checkBtn.className = "check";
  if (task.completed) checkBtn.classList.add("done");

  checkBtn.onclick = () => {
    task.completed = !task.completed;
    saveTasks();
    renderTasks();
  };

  const deleteBtn = document.createElement("button");
  deleteBtn.innerHTML = "🗑️";
  deleteBtn.className = "delete";
  deleteBtn.onclick = () => {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
  };

  actions.append(checkBtn, deleteBtn);
  li.append(span, actions);

  return li;
}

// ==========================
// RENDER
// ==========================
function renderTasks() {
  taskList.innerHTML = "";

  let filtered = tasks;

  if (currentFilter === "pending") {
    filtered = tasks.filter(t => !t.completed);
  }
  if (currentFilter === "completed") {
    filtered = tasks.filter(t => t.completed);
  }

  // EMPTY STATE
  if (tasks.length === 0) {
    emptyState.style.display = "block";
    emptyState.textContent = "No tasks yet. Add your first task 👆";
  } else {
    emptyState.style.display = "none";
  }

  filtered.forEach(task => {
    const index = tasks.indexOf(task);
    taskList.appendChild(createTaskElement(task, index));
  });

  updateCounter();
}

// ==========================
// COUNTER
// ==========================
function updateCounter() {
  const completed = tasks.filter(t => t.completed).length;
  taskCounter.textContent = `Total: ${tasks.length} | Completed: ${completed}`;
}

// ==========================
// ADD TASK
// ==========================
taskForm.onsubmit = e => {
  e.preventDefault();
  tasks.push({ text: taskInput.value, completed: false });
  taskInput.value = "";
  saveTasks();
  renderTasks();
};

// ==========================
// FILTERS
// ==========================
filterButtons.forEach(btn => {
  btn.onclick = () => {
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderTasks();
  };
});

// ==========================
// DARK MODE
// ==========================
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  toggleThemeBtn.textContent = "☀ Light Mode";
}

toggleThemeBtn.onclick = () => {
  document.body.classList.toggle("dark");
  const dark = document.body.classList.contains("dark");
  localStorage.setItem("theme", dark ? "dark" : "light");
  toggleThemeBtn.textContent = dark ? "☀ Light Mode" : "🌙 Dark Mode";
};

// INIT
renderTasks();
