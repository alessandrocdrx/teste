const STORAGE_KEY = "crud-colorido-items";

const form = document.getElementById("item-form");
const idInput = document.getElementById("item-id");
const nameInput = document.getElementById("item-name");
const colorInput = document.getElementById("item-color");
const priorityInput = document.getElementById("item-priority");
const submitBtn = document.getElementById("submit-btn");
const cancelBtn = document.getElementById("cancel-btn");
const searchInput = document.getElementById("search-input");
const list = document.getElementById("item-list");
const emptyState = document.getElementById("empty-state");
const counter = document.getElementById("counter");

let items = loadItems();

function loadItems() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveItems() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function resetForm() {
  form.reset();
  idInput.value = "";
  submitBtn.textContent = "Adicionar";
  cancelBtn.classList.add("hidden");
}

function createItem(name, color, priority) {
  return {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
    name,
    color,
    priority,
  };
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = nameInput.value.trim();
  const color = colorInput.value;
  const priority = priorityInput.value;

  if (!name) return;

  if (idInput.value) {
    const item = items.find((i) => i.id === idInput.value);
    if (item) {
      item.name = name;
      item.color = color;
      item.priority = priority;
    }
  } else {
    items.push(createItem(name, color, priority));
  }

  saveItems();
  resetForm();
  render();
});

cancelBtn.addEventListener("click", resetForm);

searchInput.addEventListener("input", render);

function editItem(id) {
  const item = items.find((i) => i.id === id);
  if (!item) return;

  pendingDeleteId = null;
  idInput.value = item.id;
  nameInput.value = item.name;
  colorInput.value = item.color;
  priorityInput.value = item.priority;
  submitBtn.textContent = "Salvar alterações";
  cancelBtn.classList.remove("hidden");
  nameInput.focus();
}

let pendingDeleteId = null;

function deleteItem(id) {
  items = items.filter((i) => i.id !== id);
  saveItems();
  if (idInput.value === id) resetForm();
  pendingDeleteId = null;
  render();
}

function render() {
  const query = searchInput.value.trim().toLowerCase();
  const filtered = items.filter((i) => i.name.toLowerCase().includes(query));

  list.innerHTML = "";

  filtered.forEach((item) => {
    const li = document.createElement("li");
    li.className = `item color-${item.color}`;

    const info = document.createElement("div");
    info.className = "item-info";

    const name = document.createElement("div");
    name.className = "item-name";
    name.textContent = item.name;

    const meta = document.createElement("div");
    meta.className = "item-meta";
    const badge = document.createElement("span");
    badge.className = `badge badge-${item.priority}`;
    badge.textContent = item.priority;
    meta.appendChild(badge);

    info.appendChild(name);
    info.appendChild(meta);

    const actions = document.createElement("div");
    actions.className = "item-actions";

    const editBtn = document.createElement("button");
    editBtn.className = "btn btn-edit btn-small";
    editBtn.textContent = "Editar";
    editBtn.addEventListener("click", () => editItem(item.id));

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn btn-danger btn-small";
    if (pendingDeleteId === item.id) {
      deleteBtn.textContent = "Confirmar?";
      deleteBtn.addEventListener("click", () => deleteItem(item.id));
    } else {
      deleteBtn.textContent = "Excluir";
      deleteBtn.addEventListener("click", () => {
        pendingDeleteId = item.id;
        render();
      });
    }

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    li.appendChild(info);
    li.appendChild(actions);
    list.appendChild(li);
  });

  emptyState.classList.toggle("hidden", filtered.length > 0);
  counter.textContent = `${items.length} ${items.length === 1 ? "item" : "itens"}`;
}

render();
