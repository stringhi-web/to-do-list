// ELEMENTOS
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const filterButtons = document.querySelectorAll(".filters button");

// ESTADO
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

// SALVAR NO LOCALSTORAGE
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// CRIAR ITEM DA LISTA
function createTaskElement(task, index) {
  const li = document.createElement("li");
  if (task.completed) li.classList.add("completed");

  // TEXTO
  const span = document.createElement("span");
  span.className = "task-text";
  span.textContent = task.text;

  // AÇÕES
  const actions = document.createElement("div");
  actions.className = "task-actions";

  // BOTÃO CHECK
  const checkBtn = document.createElement("button");
  checkBtn.className = "check";
  checkBtn.innerHTML = "✔";
  checkBtn.addEventListener("click", () => {
    task.completed = !task.completed;
    saveTasks();
    renderTasks();
  });

  // BOTÃO DELETE
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

// RENDERIZAR TAREFAS
function renderTasks() {
  taskList.innerHTML = "";

  let filteredTasks = tasks;

  if (currentFilter === "pending") {
    filteredTasks = tasks.filter(task => !task.completed);
  } else if (currentFilter === "completed") {
    filteredTasks = tasks.filter(task => task.completed);
  }

  if (filteredTasks.length === 0) {
    const empty = document.createElement("li");
    empty.id = "emptyState";
    empty.textContent = "No tasks found";
    taskList.appendChild(empty);
    return;
  }

  filteredTasks.forEach((task) => {
    const index = tasks.indexOf(task);
    const taskElement = createTaskElement(task, index);
    taskList.appendChild(taskElement);
  });
}

// ADICIONAR TAREFA
taskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const text = taskInput.value.trim();
  if (text === "") return;

  tasks.push({
    text: text,
    completed: false,
  });

  taskInput.value = "";
  saveTasks();
  renderTasks();
});

// FILTROS
filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    filterButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    currentFilter = button.dataset.filter;
    renderTasks();
  });
});

// INICIALIZAÇÃO
renderTasks();
