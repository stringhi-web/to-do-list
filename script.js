// ==========================
// ELEMENTOS
// ==========================
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const filterButtons = document.querySelectorAll(".filters button");
const toggleThemeBtn = document.getElementById("toggleTheme");
const taskCounter = document.getElementById("taskCounter");
const emptyState = document.getElementById("emptyState");

// ==========================
// ESTADO
// ==========================
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

// ==========================
// LOCALSTORAGE
// ==========================
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ==========================
// CRIAR ITEM
// ==========================
function createTaskElement(task, index) {
  const li = document.createElement("li");
  if (task.completed) li.classList.add("completed");

  // Texto
  const span = document.createElement("span");
  span.className = "task-text";
  span.textContent = task.text;

  // ✏️ Editar com duplo clique
  span.addEventListener("dblclick", () => {
    const input = document.createElement("input");
    input.type = "text";
    input.value = task.text;
    input.className = "edit-input";

    li.replaceChild(input, span);
    input.focus();

    function saveEdit() {
      const newText = input.value.trim();
      if (newText !== "") {
        task.text = newText;
        saveTasks();
      }
      renderTasks();
    }

    input.addEventListener("blur", saveEdit);

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") saveEdit();
      if (e.key === "Escape") renderTasks();
    });
  });

  // Ações
  const actions = document.createElement("div");
  actions.className = "task-actions";

  // ✔ Check
  const checkBtn = document.createElement("button");
  checkBtn.className = "check";
  checkBtn.innerHTML = "✔";

  if (task.completed) checkBtn.classList.add("done");

  checkBtn.addEventListener("click", () => {
    task.completed = !task.completed;
    saveTasks();
    renderTasks();
  });

  // 🗑️ Delete
  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete";
  deleteBtn.innerHTML = "🗑️";

  deleteBtn.addEventListener("click", () => {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
  });

  actions.appendChild(checkBtn);
  actions.appendChild(deleteBtn);

  li.appendChild(span);
  li.appendChild(actions);

  return li;
}

// ==========================
// RENDER
// ==========================
function renderTasks() {
  taskList.innerHTML = "";

  let filteredTasks = tasks;

  if (currentFilter === "pending") {
    filteredTasks = tasks.filter(t => !t.completed);
  } else if (currentFilter === "completed") {
    filteredTasks = tasks.filter(t => t.completed);
  }

  // Empty state
  if (tasks.length === 0) {
    emptyState.style.display = "block";
  } else {
    emptyState.style.display = "none";
  }

  filteredTasks.forEach((task) => {
    const index = tasks.indexOf(task);
    taskList.appendChild(createTaskElement(task, index));
  });

  updateCounter();
}

// ==========================
// CONTADOR
// ==========================
function updateCounter() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  taskCounter.textContent = `Total: ${total} | Completed: ${completed}`;
}

// ==========================
// ADD TASK
// ==========================
taskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const text = taskInput.value.trim();
  if (!text) return;

  tasks.push({
    text,
    completed: false
  });

  taskInput.value = "";
  saveTasks();
  renderTasks();
});

// ==========================
// FILTROS
// ==========================
filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("active"));
    button.classList.add("active");
    currentFilter = button.dataset.filter;
    renderTasks();
  });
});

// ==========================
// DARK MODE
// ==========================
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  toggleThemeBtn.textContent = "☀ Light Mode";
}

toggleThemeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
    toggleThemeBtn.textContent = "☀ Light Mode";
  } else {
    localStorage.setItem("theme", "light");
    toggleThemeBtn.textContent = "🌙 Dark Mode";
  }
});

// ==========================
// INIT
// ==========================
renderTasks();
