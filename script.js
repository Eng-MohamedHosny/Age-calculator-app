"use strict";
// ==== Global Elements ====
const dayInputEl = document.querySelector(".day-input");
const monthInputEl = document.querySelector(".month-input");
const yearInputEl = document.querySelector(".year-input");

const ageYearsEl = document.getElementById("age-years");
const ageMonthsEl = document.getElementById("age-months");
const ageDaysEl = document.getElementById("age-days");

const btnCalcAge = document.querySelector(".arrow-btn");

let dayInput, monthInput, yearInput;

function addErrorState(item, message = "") {
  document.querySelector(`.${item}-container`).classList.add("error-state");

  document.querySelector(`.${item}-error`).textContent = message;
  document.querySelector(`.${item}-container .error-message`).style.display =
    "block";
}

function removeErrorState(item) {
  document.querySelector(`.${item}-container`).classList.remove("error-state");
  document.querySelector(`.${item}-container .error-message`).style.display =
    "none";
}

const displayError = function (error) {
  ["day", "month", "year"].forEach((datePart) => {
    if (error[`${datePart}Message`]) {
      addErrorState(datePart, error[`${datePart}Message`]);
    } else {
      removeErrorState(datePart);
    }
  });

  return error.isValidDay && error.isValidMonth && error.isValidYear;
};

function ResetTheAge() {
  ageYearsEl.textContent = "--";
  ageMonthsEl.textContent = "--";
  ageDaysEl.textContent = "--";
}

const isValidDate = function (day, month, year) {
  const date = new Date(year, month - 1, day);
  date.setFullYear(year);
  const now = new Date();
  const error = {
    isValidYear: true,
    isValidMonth: true,
    isValidDay: true,
    dayMessage: "",
    monthMessage: "",
    yearMessage: "",
  };
  // ****** This part to validate Only if the field is not empty and if it is in a valid range  *****
  if (yearInputEl.value === "") {
    error.yearMessage = "This field is required";
    error.isValidYear = false;
  } else if (year > now.getFullYear()) {
    error.yearMessage = "Must be in the past";
    error.isValidYear = false;
  }
  //check month
  if (monthInputEl.value === "") {
    error.monthMessage = "This field is required";
    error.isValidMonth = false;
  } else if (month > 12 || month < 1) {
    error.monthMessage = "Must be a valid month";
    error.isValidMonth = false;
  }
  //check day
  if (dayInputEl.value === "") {
    error.dayMessage = "This field is required";
    error.isValidDay = false;
  } else if (day < 1 || day > 31) {
    error.dayMessage = "Must be a valid day";
    error.isValidDay = false;
  }
  ///////////////////////////////////////////////////////////////////
  // is valid date like not 31 days in a month with only 30 days
  //Compare it with the date constructed by javascript
  // if they are identical then valid date else then not valid
  if (
    error.isValidDay &&
    error.isValidMonth &&
    error.isValidYear &&
    !(day === date.getDate() && month === date.getMonth() + 1)
  ) {
    error.dayMessage = "Must be a valid date";
    error.monthMessage = "   ";
    error.yearMessage = "   ";
    error.isValidDay = false;
    error.isValidMonth = false;
    error.isValidYear = false;
  }
  /////////////////////////////////////////////////////////////////
  //*** This part to check the whole date not in the future
  if (
    error.isValidDay &&
    error.isValidMonth &&
    error.isValidYear &&
    year === now.getFullYear()
  ) {
    if (month > now.getMonth() + 1) {
      error.monthMessage = "Must be in the past";
      error.isValidMonth = false;
    } else if (now.getMonth() + 1 === month) {
      if (day > now.getDate()) {
        error.dayMessage = "Must be in the past";
        error.isValidDay = false;
      }
    }
  }

  return displayError(error);
};

function calcAge(birthDate) {
  const today = new Date();
  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  let days = today.getDate() - birthDate.getDate();

  // 1. If days are negative, borrow from the previous month
  if (days < 0) {
    months--; // Reduce the month count

    // Get the last day of the PREVIOUS month
    const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += lastMonth.getDate();
  }

  // 2. If months are negative, borrow from the year
  if (months < 0) {
    years--; // Reduce the year count
    months += 12;
  }

  return { years, months, days };
}

function calcAgeAction() {
  dayInput = Number(dayInputEl.value);
  monthInput = Number(monthInputEl.value);
  yearInput = Number(yearInputEl.value);
  const birthDate = new Date(yearInput, monthInput - 1, dayInput);
  birthDate.setFullYear(yearInput);
  //validate input
  if (isValidDate(dayInput, monthInput, yearInput)) {
    //calculate age
    const age = calcAge(birthDate);
    // display age
    ageYearsEl.textContent = age.years;
    ageMonthsEl.textContent = age.months;
    ageDaysEl.textContent = age.days;
  } else {
    ResetTheAge();
  }
}

btnCalcAge.addEventListener("click", calcAgeAction);

document.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    calcAgeAction();
  }
});
