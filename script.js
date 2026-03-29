let users = JSON.parse(localStorage.getItem("users")) || [];
let currentUser = localStorage.getItem("currentUser");

function getTasks(){
  return JSON.parse(localStorage.getItem(currentUser+"_tasks")) || [];
}
function saveTasks(t){
  localStorage.setItem(currentUser+"_tasks", JSON.stringify(t));
}

// PASSWORD TOGGLE
function togglePassword(id, icon) {
  let input = document.getElementById(id);
  input.type = input.type === "password" ? "text" : "password";
  icon.textContent = input.type === "password" ? "👁️" : "🙈";
}

// PASSWORD STRENGTH
signupPass?.addEventListener("input", () => {
  let val = signupPass.value;
  let strength = document.getElementById("strength");

  if (val.length < 4) {
    strength.style.background = "red";
  } else if (val.length < 8) {
    strength.style.background = "orange";
  } else {
    strength.style.background = "green";
  }
});

// SIGNUP
function signup() {
  let user = signupUser.value;
  let pass = signupPass.value;
  let confirm = confirmPass.value;
  let error = document.getElementById("error");

  if (!user || !pass || !confirm) {
    error.innerText = "All fields required";
    return;
  }

  if (pass !== confirm) {
    error.innerText = "Passwords do not match";
    return;
  }

  if (pass.length < 6) {
    error.innerText = "Password must be at least 6 characters";
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];

  if (users.find(u => u.u === user)) {
    error.innerText = "User already exists";
    return;
  }

  users.push({ u: user, p: pass });
  localStorage.setItem("users", JSON.stringify(users));

  alert("Signup successful");
  location = "index.html";
}

// LOGIN
function login() {
  let user = loginUser.value;
  let pass = loginPass.value;
  let error = document.getElementById("loginError");

  let users = JSON.parse(localStorage.getItem("users")) || [];

  let valid = users.find(u => u.u === user && u.p === pass);

  if (!valid) {
    error.innerText = "Invalid username or password";
    return;
  }

  localStorage.setItem("currentUser", user);
  location = "dashboard.html";
}

// LOGOUT
function logout(){
  localStorage.removeItem("currentUser");
  location="index.html";
}

// LOAD
if(location.pathname.includes("dashboard")){
  user.innerText=currentUser;
  renderTasks();
}

// ADD
function addTask(){
  let t=getTasks();
  t.push({text:taskInput.value,completed:false});
  saveTasks(t);
  taskInput.value="";
  renderTasks();
  saveTasks(tasks);
  updateStats();
}

// RENDER

function renderTasks(){
  let tasks = getTasks();
  taskList.innerHTML = "";

  let search = document.getElementById("search").value.toLowerCase();
  let filter = document.getElementById("filter").value;

  tasks.forEach((task, i) => {

    // FILTER LOGIC
    if(!task.text.toLowerCase().includes(search)) return;
    if(filter === "completed" && !task.completed) return;
    if(filter === "pending" && task.completed) return;

    let div = document.createElement("div");
    div.className = "task" + (task.completed ? " completed" : "");

    // IMPORTANT: store real index
    div.setAttribute("data-index", i);

    div.draggable = true;

    div.ondragstart = (e) => {
      dragIndex = e.target.getAttribute("data-index");
    };

    div.ondragover = (e) => e.preventDefault();

    div.ondrop = (e) => {
      let dropIndex = e.target.closest(".task").getAttribute("data-index");
      swapTasks(dragIndex, dropIndex);
    };

    div.innerHTML = `
      <span onclick="toggleTask(${i})">
        ${task.completed ? "✅" : "⬜"} ${task.text}
      </span>
      <div>
        <button onclick="editTask(${i})">✏️</button>
        <button onclick="deleteTask(${i})">❌</button>
      </div>
    `;

    taskList.appendChild(div);
  });

  updateStats();
}

// FUNCTIONS
function toggleTask(i){
  let t=getTasks();
  t[i].completed=!t[i].completed;
  saveTasks(t);
  renderTasks();
}

function deleteTask(i){
  let t=getTasks();
  t.splice(i,1);
  saveTasks(t);
  renderTasks();
}

function editTask(i){
  let t=getTasks();
  let n=prompt("Edit",t[i].text);
  if(n){t[i].text=n;saveTasks(t);}
  renderTasks();
}

function swapTasks(from, to){
  let tasks = getTasks();

  from = Number(from);
  to = Number(to);

  let temp = tasks[from];
  tasks[from] = tasks[to];
  tasks[to] = temp;

  saveTasks(tasks);
  renderTasks();
}
// THEME
function toggleTheme() {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
}
function updateStats() {
  let tasks = getTasks();

  let total = tasks.length;
  let completed = tasks.filter(t => t.completed === true).length;

  document.getElementById("totalTasks").innerText = total;
  document.getElementById("completedTasks").innerText = completed;
}