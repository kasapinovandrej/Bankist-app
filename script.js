'use strict';
//1st section arrey data
// const account1 = {
//   owner: 'Jonas Schmedtmann',
//   movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
//   interestRate: 1.2, // %
//   pin: 1111,
// };
// const account2 = {
//   owner: 'Jessica Davis',
//   movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
//   interestRate: 1.5,
//   pin: 2222,
// };
// const account3 = {
//   owner: 'Steven Thomas Williams',
//   movements: [200, -200, 340, -300, -20, 50, 400, -460],
//   interestRate: 0.7,
//   pin: 3333,
// };
// const account4 = {
//   owner: 'Sarah Smith',
//   movements: [430, 1000, 700, 50, 90],
//   interestRate: 1,
//   pin: 4444,
// };
// const accounts = [account1, account2, account3, account4];
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP
/////////////////////////////////////////////////
// Data
// DIFFERENT DATA! Contains movement dates, currency and locale
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-11-19T17:01:17.194Z',
    '2020-11-20T23:36:17.929Z',
    '2020-11-21T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'sr-RS',       //'pt-PT' // de-DE //sr-RS
};
const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};
const accounts = [account1, account2];
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');
const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');
const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');
const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');
/*--------------------------------------------------------------------*/
/*...izvuceno iz displayMovements-a zato sto je Jonas dokon*/
const formatMovementDate = function (date, locale) {
  const daysPast = (date1, date2) => Math.round(Math.abs(date1 - date2) / (1000 * 60 * 60 * 24));
  const daysPassed = daysPast(new Date(), date)
  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    // zakomentarisano zbog lang format-a
    // const year = date.getFullYear();
    // const month = `${date.getMonth() + 1}`.padStart(2, 0);
    // const day = `${date.getDate()}`.padStart(2, 0);
    // return `${day}.${month}.${year}.`;
    return new Intl.DateTimeFormat(locale).format(date);
  }
};
//reusable.. moze da se koristi u bilo kojoj app
const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};
//funkcija prikazuje promene na racunu u UI
//sada sam dodao SORT funkciju ovde
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acc.movementsDates[i])
    const displayDate = formatMovementDate(date, acc.locale);
    const formattedMov = formatCur(mov, acc.locale, acc.currency);
    const html = `
    <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
    </div>`
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
/*--------------------------------------------------------------------*/
//racuna current balance i ispisuje ga
const calcPrintBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${formatCur(acc.balance, acc.locale, acc.currency)}`;
}
/*----------------------------------------------------------------------*/
//racuna income output i intrest
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements.filter(mov => mov > 0).reduce((acc, cur) => acc + cur, 0)
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);
  const out = acc.movements.filter(mov => mov < 0).reduce((acc, cur) => acc + cur, 0);
  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);
  const intrest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => deposit * 1.2 / 100)
    .filter((intrests) => intrests >= 1)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumInterest.textContent = formatCur(intrest, acc.locale, acc.currency);
};
/*---------------------------------------------------------------------*/
//ova funkcija samo pravi novi propperty userName u accounts objektu (inicijale)
const createUserNames = function (accs) {
  accs.forEach(function (acc) {
    acc.userName = acc.owner
      .toLowerCase()
      .split(' ')
      .map(move => move.slice(0, 1))
      .join('');
  });
};
createUserNames(accounts);
/*--------------------------------------------------------------------*/
//update UI funkcija
const updateUI = function (acc) {
  //display movements
  displayMovements(acc);
  //display balance
  calcPrintBalance(acc);
  //display summary
  calcDisplaySummary(acc);
};
/*--------------------------------------------------------------------*/
//start logOut
const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    //In each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;
    //when 0 sec, stop timer and logOut user
    if (time === 0) {
      clearInterval(timer);
      containerApp.style.opacity = `0`;
      labelWelcome.textContent = `Log in to get started`
    }
    //smanjiti za 1sec
    time--;
  }
  //set time to 5min
  let time = 30;
  //Call the timer every second
  tick();
  const timer = setInterval(tick, 1000);
  return timer
};
/*--------------------------------------------------------------------*/
//Event handler - dugmici
let currentAccount, timer;
//za logged in
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = '1';
btnLogin.addEventListener('click', function (e) {
  //prevent form from submitting
  e.preventDefault();
  currentAccount = accounts.find(acc => acc.userName === inputLoginUsername.value);
  if (currentAccount?.pin === +inputLoginPin.value) {
    //display UI and welcome msg 
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = `1`;
    //datum i vreme formatirano ISO po lokal language... zakomentarisano prethodno
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric', //bilo 'long' zbog jezika u app sada 'numeric'
      year: 'numeric',
      //weekday: 'long' //zbog jezika u app zakomentarisano
    };
    //const locale = navigator.language;
    labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale, options).format(now);
    // const year = now.getFullYear();
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const day = `${now.getDate()}`.padStart(2, 0);
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const min = `${now.getMinutes()}`.padStart(2, 0);
    // labelDate.textContent = `${day}.${month}.${year}. at ${hour}:${min} `
    //clear input fields
    inputLoginPin.value = inputLoginUsername.value = '';
    inputLoginPin.blur();
    //Timer
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();
    //update UI
    updateUI(currentAccount);
  };
});
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const reciverAccount = accounts.find(acc => acc.userName === inputTransferTo.value);
  //proveriti da li ima korisnik dovoljno novca na racunu
  if (amount > 0 && reciverAccount && currentAccount.balance >= amount && reciverAccount.userName !== currentAccount?.userName) {
    currentAccount.movements.push(-amount);
    reciverAccount.movements.push(amount);
    //clear input fields
    inputTransferAmount.value = inputTransferTo.value = '';
    inputLoginPin.blur();
    //datum transfera
    currentAccount.movementsDates.push(new Date().toISOString());
    reciverAccount.movementsDates.push(new Date().toISOString());
    //update UI
    updateUI(currentAccount);
    //reset timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    //vreme za odobravanje pozajmice
    setTimeout(function () {
      //add movement 
      currentAccount.movements.push(amount);
      //datum pozajmice
      currentAccount.movementsDates.push(new Date().toISOString());
      //update UI
      updateUI(currentAccount);
      //reset timer
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 3000);
  }
  //clear input fields
  inputLoanAmount.value = '';
});
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  //check current user and PIN
  if (inputCloseUsername.value === currentAccount.userName && +inputClosePin.value === currentAccount.pin) {
    const index = accounts.findIndex(acc => acc.userName === currentAccount.userName);
    //delete account
    accounts.splice(index, 1);
    //hide UI
    containerApp.style.opacity = `0`;
    ;
  }
  //clear input values
  inputCloseUsername.value = inputClosePin.value = '';
});
//definisem sorted van funkcije da bih onclick vracao u pocetno stanje. u funkciju dole kao parametar stavljam !sorted
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});
//svaki drugi row da bude druga boja(proveravam paran broj '%')
// document.querySelector('.balance__value').addEventListener('click', function () {
//   [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
//     if (i % 2 === 0) {
//       row.style.backgroundColor = '#53e9fc';
//     }
//za svaki treci red...
// if (i % 3 === 0) {
//   row.style.backgroundColor = '#ffe08c';
// }
//   });
// })
