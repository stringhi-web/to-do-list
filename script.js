document.addEventListener("DOMContentLoaded", () => {

  const taskInput = document.getElementById("taskInput");
  const taskList = document.getElementById("taskList");
  const form = document.getElementById("taskForm");

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  // Carregar tarefas salvas
  tasks.forEach(task => createTask(task.text, task.completed));

  // Enviar formulário (Enter ou botão)
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    addTask(taskInput.value);
  });

  function addTask(text) {
    const taskText = text.trim();

    if (taskText === "") {
      return;
    }

    const task = {
      text: taskText,
      completed: false
    };

    tasks.push(task);
    saveTasks();
    createTask(task.text, task.completed);

    taskInput.value = "";
  }

  function createTask(text, completed) {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = text;

    if (completed) {
      span.classList.add("completed");
    }

    span.addEventListener("click", () => {
      span.classList.toggle("completed");
      updateTasks();
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "X";

    deleteBtn.addEventListener("click", () => {
      li.remove();
      tasks = tasks.filter(t => t.text !== text);
      saveTasks();
    });

    li.appendChild(span);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  }

  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function updateTasks() {
    tasks = [];
    document.querySelectorAll("#taskList li").forEach(li => {
      const span = li.querySelector("span");
      tasks.push({
        text: span.textContent,
        completed: span.classList.contains("completed")
      });
    });
    saveTasks();
  }

});
