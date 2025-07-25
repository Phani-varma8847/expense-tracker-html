const balance = document.getElementById("balance");
const money_plus = document.getElementById("money-plus");
const money_minus = document.getElementById("money-minus");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

function addTransaction(e) {
  e.preventDefault();

  if (text.value.trim() === "" || amount.value.trim() === "") {
    alert("Please enter both text and amount");
    return;
  }

  const transaction = {
    id: generateID(),
    text: text.value,
    amount: +amount.value
  };

  transactions.push(transaction);
  updateDOM();
  updateValues();
  updateLocalStorage();

  text.value = "";
  amount.value = "";
}

function generateID() {
  return Math.floor(Math.random() * 100000000);
}

function updateDOM() {
  list.innerHTML = "";

  transactions.forEach((transaction) => {
    const sign = transaction.amount < 0 ? "-" : "+";
    const item = document.createElement("li");
    item.classList.add(transaction.amount < 0 ? "minus" : "plus");

    item.innerHTML = `
      ${transaction.text} <span>${sign}$${Math.abs(transaction.amount)}</span>
      <button onclick="removeTransaction(${transaction.id})">x</button>
    `;

    list.appendChild(item);
  });
}

function updateValues() {
  const amounts = transactions.map((t) => t.amount);
  const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);
  const income = amounts.filter((a) => a > 0).reduce((acc, item) => acc + item, 0).toFixed(2);
  const expense = (
    amounts.filter((a) => a < 0).reduce((acc, item) => acc + item, 0) * -1
  ).toFixed(2);

  balance.innerText = `$${total}`;
  money_plus.innerText = `+$${income}`;
  money_minus.innerText = `-$${expense}`;
}

function removeTransaction(id) {
  transactions = transactions.filter((t) => t.id !== id);
  updateDOM();
  updateValues();
  updateLocalStorage();
}

function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

form.addEventListener("submit", addTransaction);

// Initial load
updateDOM();
updateValues();
