const name = document.querySelector("#name");
const secondName = document.querySelector("#secondName");
const email = document.querySelector("#email");
const btn = document.querySelector(".btn");
const users = document.querySelector(".users");
const clear = document.querySelector(".clear");
const number = document.querySelector(".number");
let keyForChange;

// Объект для localStorage, забирает информацию по ключу 'users'
const storage = JSON.parse(localStorage.getItem("users")) || {};

// Функция установки слушателей на HTML узлы
function setListeners() {
  const del = document.querySelectorAll(".delete");
  const change = document.querySelectorAll(".change");
  let clicked;

  del.forEach((n) => {
    n.addEventListener("click", () => {
      console.log("УДАЛИТЬ кнопка");
      console.log("=== NODE:", n);
      clicked = n.getAttribute("data-delete");

      const outer = document.querySelector(`[data-out="${clicked}"]`);
      console.log("=== outer", outer);
      delete storage[clicked];
      localStorage.users = JSON.stringify(storage);
      window.location.reload();
    });
  });

  change.forEach((n) => {
    n.addEventListener("click", () => {
      console.log("=== ПРИМЕНИТЬ кнопка");
      clicked = n.getAttribute("data-change");

      const outer = document.querySelector(`[data-out="${clicked}"]`);
      name.value = outer.childNodes[1].childNodes[1].innerText;
      secondName.value = outer.childNodes[1].childNodes[3].innerText;
      email.value = outer.childNodes[1].childNodes[5].innerText;
      number.value = outer.childNodes[1].childNodes[7].innerText;
      keyForChange = email.value;
    });
  });
}

// Функция очистки хранилища localStorage по ключу `users`
function clearLocalStorage() {
  window.location.reload();
  localStorage.removeItem("users");
}

// Функция создания карточки
function createCard({ name, secondName, email, number }) {
  return `
    <div data-out=${email} class="user-outer">
        <div class="user-info">
            <p>${name}</p>
            <p>${secondName}</p>
            <p>${email}</p>
            <p>${number}</p>
        </div>
        <div class="menu">
            <button data-delete=${email} class="delete">Удалить</button>
            <button data-change=${email} class="change">Применить</button>
        </div>
    </div>
  `;
}

// Функция обновления карточки
function rerenderCard(storage) {
  users.innerHTML = "";

  /*
    storage имеет структуру
    storage = {
        email1: {
            name: '',
            secondName: '',
            email: ''
        },
        email2: {
            name: '',
            secondName: '',
            email: '',
        }
    }
  */

  /*
    Object.etries переводит объект в массив
    Object.etries(storage) ===>>>> [
            ['email1', {name: '', secondName: '', email: ''}],
            ['email2', {name: '', secondName: '', email: ''}]
        ]
  */

  Object.entries(storage).forEach((user) => {
    // user = ['email1', {name: '', secondName: '', email: ''}]
    const [email, userData] = user;
    console.log("USER  === ", user);
    console.log("EMAIL === ", email);
    console.log("DATA  === ", userData);

    const div = document.createElement("div");
    div.className = "user";
    div.innerHTML = createCard(userData);
    users.append(div);
  });
}

// Функция получения данных из хранилища localStorage по ключу `users`
function getData(e) {
  e.preventDefault();
  const data = {};

  data.name = name.value || "";
  data.secondName = secondName.value || "";
  data.email = email.value || "";
  data.number = number.value || "";

  const key = data.email;
  storage[key] = data;

  localStorage.setItem("users", JSON.stringify(storage));

  rerenderCard(JSON.parse(localStorage.getItem("users")));

  if (keyForChange !== data.email) {
    delete storage[keyForChange];
    localStorage.users = JSON.stringify(storage);
    window.location.reload();
  }

  return data;
}

// Экземпляр объекта, наблюдающий за DOM-элементом и запускающий колбэк в случае изменений
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.addedNodes.length || mutation.removedNodes.length) {
      console.log("Карточка USERS обновилась");
      setListeners();
    }
  });
});

observer.observe(users, {
  childList: true,
});

btn.addEventListener("click", getData);
clear.addEventListener("click", clearLocalStorage);

// После перезагрузки страницы подтягиваем данные из localStorage
window.onload = rerenderCard(JSON.parse(localStorage.getItem("users")));
