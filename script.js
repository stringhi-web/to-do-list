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

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

// ==========================
// SALVAR NO LOCALSTORAGE
// ==========================
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ==========================
// CRIAR ELEMENTO DE TAREFA
// ==========================
function createTaskElement(task, index) {
  const li = document.createElement("li");
  if (task.completed) li.classList.add("completed");

  const span = document.createElement("span");
  span.className = "task-text";
  span.textContent = task.text;

  if (task.completed) span.classList.add("completed");

  const actions = document.createElement("div");
  actions.className = "task-actions";

  const checkBtn = document.createElement("button");
  checkBtn.className = "check";
  checkBtn.innerHTML = "✔";
  if (task.completed) checkBtn.classList.add("done");

  deleteBtn.addEventListener("click", () => {
  li.classList.add("removing");

  setTimeout(() => {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
  }, 200);
});


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
// RENDERIZAR TODAS TAREFAS
// ==========================
function renderTasks() {
  taskList.innerHTML = "";

  let filteredTasks = tasks;

  if (currentFilter === "pending") {
    filteredTasks = tasks.filter(task => !task.completed);
  } else if (currentFilter === "completed") {
    filteredTasks = tasks.filter(task => task.completed);
  }

  if (filteredTasks.length === 0) {
    emptyState.style.display = "block";
  } else {
    emptyState.style.display = "none";
    filteredTasks.forEach((task) => {
      const index = tasks.indexOf(task);
      const taskElement = createTaskElement(task, index);
      taskList.appendChild(taskElement);
    });
  }

  updateTaskCounter();
}

// ==========================
// CONTADOR DE TAREFAS
// ==========================
function updateTaskCounter() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  taskCounter.textContent = `Total: ${total} | Completed: ${completed}`;
}

// ==========================
// ADICIONAR NOVA TAREFA
// ==========================
taskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const text = taskInput.value.trim();
  if (text === "") return;

  tasks.push({
    text: text,
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
    filterButtons.forEach(btn => btn.classList.remove("active"));
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
// INICIALIZAÇÃO
// ==========================
renderTasks();

