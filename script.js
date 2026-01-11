const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const form = document.getElementById("taskForm");
const filterButtons = document.querySelectorAll(".filters button");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

/* Carregar tarefas */
window.onload = () => {
  renderTasks();
};

/* Adicionar tarefa */
form.addEventListener("submit", (e) => {
  e.preventDefault();
  addTask(taskInput.value);
});

function addTask(text) {
  const taskText = text.trim();
  if (!taskText) return;

  tasks.push({ text: taskText, completed: false });
  saveTasks();
  renderTasks();

  taskInput.value = "";
}

/* Renderizar tarefas */
function renderTasks() {
  taskList.innerHTML = "";

  let filteredTasks = tasks;

  if (currentFilter === "pending") {
    filteredTasks = tasks.filter(task => !task.completed);
  }

  if (currentFilter === "completed") {
    filteredTasks = tasks.filter(task => task.completed);
  }

  filteredTasks.forEach(task => createTask(task));
}

/* Criar item */
function createTask(task) {
  const li = document.createElement("li");

  const span = document.createElement("span");
  span.textContent = task.text;

  if (task.completed) span.classList.add("completed");

  span.addEventListener("click", () => {
    task.completed = !task.completed;
    saveTasks();
    renderTasks();
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "X";

  deleteBtn.addEventListener("click", () => {
    tasks = tasks.filter(t => t !== task);
    saveTasks();
    renderTasks();
  });

  li.appendChild(span);
  li.appendChild(deleteBtn);
  taskList.appendChild(li);
}

/* Filtros */
filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    filterButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    currentFilter = button.dataset.filter;
    renderTasks();
  });
});

/* LocalStorage */
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
