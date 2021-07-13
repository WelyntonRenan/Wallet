const transactionUl = document.querySelector('#transactions');
const incomeDisplay = document.querySelector('#money-plus');
const expenseDisplay = document.querySelector('#money-minus');
const balanceDisplay = document.querySelector('#balance');
const form = document.querySelector('#form');
const inputTransactionName = document.querySelector('#text');
const inputTransactionAmount = document.querySelector('#amount')


const localStorageTransaction = JSON.parse(localStorage
  .getItem('transactions'))
let transactions = localStorage
  .getItem('transactions') !== null ? localStorageTransaction : []

const removeTransaction = ID => {
  transactions = transactions
    .filter(transaction => transaction.id !== ID)
  init()
  updateLocalStorage()
}

const addTransactionIntoDOM = transaction => {
  const operator = transaction.amount < 0 ? '-' : '+';
  const CSSClass = transaction.amount < 0 ? 'minus' : 'plus';
  const amountWithoutOperator = Math.abs(transaction.amount);
  const li = document.createElement('li');

  li.classList.add(CSSClass);
  li.innerHTML = `${transaction.name}
  <span>${operator} R$ ${amountWithoutOperator}</span>
  <button class="delete-btn" onClick="removeTransaction(${transaction.id})">x</button>`

  transactionUl.append(li);
}


const updateBalanceValues = () => {
  const transactionsAmounts = transactions
    .map(transaction => transaction.amount);
  const total = transactionsAmounts
    .reduce((accumulator, transaction) => accumulator + transaction, 0)
    .toFixed(2);
  const income = transactionsAmounts
    .filter(value => value > 0)
    .reduce((accumulator, value) => accumulator + value, 0)
    .toFixed(2);
  const expense = Math.abs(transactionsAmounts
    .filter(value => value < 0)
    .reduce((accumulator, value) => accumulator + value, 0))
    .toFixed(2);

  balanceDisplay.textContent = `R$ ${total}`;
  incomeDisplay.textContent = `R$ ${income}`;
  expenseDisplay.textContent = `R$ ${expense}`;
}


const init = () => {
  transactionUl.innerHTML = '';
  transactions.forEach(addTransactionIntoDOM)
  updateBalanceValues();
}

init();

const updateLocalStorage = () => {
  localStorage.setItem('transactions', JSON.stringify(transactions))
}

const generateID = () => Math.round(Math.random() * 1000);

const addToTransactionArray = (transactionName, transactionAmount) => {
  transactions.push({
    id: generateID(),
    name: transactionName,
    amount: Number(transactionAmount)
  });
}

const cleanInputs = () => {
  inputTransactionName.value = '';
  inputTransactionAmount.value = '';
}

const handleFormSubmit = event => {
  event.preventDefault()

  const transactionName = inputTransactionName.value.trim()
  const transactionAmount = inputTransactionAmount.value.trim()
  const isSomeInputEmpty = transactionName === '' || transactionAmount === ''

  if (isSomeInputEmpty) {
    alert('Por favor, preencha tanto o nome quanto o valor da transação');
    return
  }

  addToTransactionArray(transactionName, transactionAmount)
  init()
  updateLocalStorage()
  cleanInputs()

}

form.addEventListener('submit', handleFormSubmit);