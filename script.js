// ============================================================
// Smart Registration Form
// Steps: 1) get elements  2) validation rules  3) show messages
//        4) bio counter   5) events            6) submit + table
// ============================================================

// ---------- 1. Get the elements from the page ----------
const form = document.getElementById("registrationForm");

const nameInput = document.getElementById("name");
const ageInput = document.getElementById("age");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const bioInput = document.getElementById("bio");

const nameError = document.getElementById("nameError");
const ageError = document.getElementById("ageError");
const genderError = document.getElementById("genderError");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const bioError = document.getElementById("bioError");

const bioCounter = document.getElementById("bioCounter");
const bioWarning = document.getElementById("bioWarning");

const submitBtn = document.getElementById("submitBtn");
const successPopup = document.getElementById("successPopup");
const popupText = document.getElementById("popupText");
const closePopupBtn = document.getElementById("closePopup");

const studentTableBody = document.getElementById("studentTableBody");
const emptyText = document.getElementById("emptyText");

const MIN_PASSWORD_LENGTH = 6;
const MAX_BIO_LENGTH = 200;
const BIO_WARNING_AT = 180;


// ---------- 2. Validation rules ----------
// Each function returns an error message, or "" when the value is valid.

function getNameError() {
  if (nameInput.value.trim() === "") {
    return "Name is required. Please enter your name.";
  }
  return "";
}

function getAgeError() {
  const ageText = ageInput.value.trim();
  const age = Number(ageText);

  if (ageText === "") {
    return "Age is required.";
  }
  if (age < 1 || age > 100) {
    return "Please enter a valid age between 1 and 100.";
  }
  return "";
}

function getSelectedGender() {
  const selected = document.querySelector('input[name="gender"]:checked');
  if (selected) {
    return selected.value;
  }
  return "";
}

function getGenderError() {
  if (getSelectedGender() === "") {
    return "Gender is required. Please choose Male or Female.";
  }
  return "";
}

function getEmailError() {
  const email = emailInput.value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (email === "") {
    return "Email is required.";
  }
  if (!emailPattern.test(email)) {
    return "Please enter a valid email, for example name@example.com.";
  }
  return "";
}

function getPasswordError() {
  const length = passwordInput.value.length;

  if (length === 0) {
    return "Password is required.";
  }
  if (length < MIN_PASSWORD_LENGTH) {
    return "Weak. Password must contain at least " + MIN_PASSWORD_LENGTH +
           " characters.";
  }
  if (length < 8) {
    return "";
  }
  return "";
}

function getPasswordHint() {
  const length = passwordInput.value.length;

  if (length === 0) {
    return "";
  }
  if (length < MIN_PASSWORD_LENGTH) {
    return "Weak. Password must contain at least " + MIN_PASSWORD_LENGTH +
           " characters.";
  }
  if (length < 8) {
    passwordError.style.color = "#ff6b00";
    return "Good";
  }
  passwordError.style.color = "green";
  return "Strong";
}

function getBioError() {
  if (bioInput.value.trim() === "") {
    return "Bio is required. Please write a short bio.";
  }
  return "";
}


// ---------- 3. Show or clear a message under a field ----------
function showFieldMessage(input, errorElement, message) {
  errorElement.textContent = message;
  errorElement.style.color = "#ff6b00";

  if (input === null) {
    return;
  }

  if (message !== "") {
    input.classList.add("invalid");
    input.classList.remove("valid");
  } else {
    input.classList.remove("invalid");
    input.classList.add("valid");
  }
}

function checkName() {
  showFieldMessage(nameInput, nameError, getNameError());
}

function checkAge() {
  showFieldMessage(ageInput, ageError, getAgeError());
}

function checkGender() {
  showFieldMessage(null, genderError, getGenderError());
}

function checkEmail() {
  showFieldMessage(emailInput, emailError, getEmailError());
}

function checkPassword() {
  const error = getPasswordError();

  if (error !== "") {
    showFieldMessage(passwordInput, passwordError, error);
    return;
  }

  const hint = getPasswordHint();
  passwordError.textContent = hint;
  passwordInput.classList.remove("invalid");
  passwordInput.classList.add("valid");
}

function checkBio() {
  showFieldMessage(bioInput, bioError, getBioError());
}


// ---------- 4. Bio character counter ----------
function updateBioCounter() {
  if (bioInput.value.length > MAX_BIO_LENGTH) {
    bioInput.value = bioInput.value.slice(0, MAX_BIO_LENGTH);
  }

  const used = bioInput.value.length;
  const left = MAX_BIO_LENGTH - used;

  bioCounter.textContent = used + " / " + MAX_BIO_LENGTH + " characters";
  bioCounter.classList.remove("near-limit", "at-limit");
  bioWarning.textContent = "";

  if (used >= MAX_BIO_LENGTH) {
    bioCounter.classList.add("at-limit");
    bioWarning.textContent = "You have reached the " + MAX_BIO_LENGTH + " character limit.";
  } else if (used >= BIO_WARNING_AT) {
    bioCounter.classList.add("near-limit");
    bioWarning.textContent = "Only " + left + " characters left.";
  }
}


// ---------- Enable Register when every field is valid ----------
// isFormValid() is true only when every error function returns "".
// updateSubmitButton() turns Register on or off.

function isFormValid() {
  return getNameError() === "" &&
         getAgeError() === "" &&
         getGenderError() === "" &&
         getEmailError() === "" &&
         getPasswordError() === "" &&
         getBioError() === "";
}

function updateSubmitButton() {
  // ! means opposite: if the form is NOT valid, keep Register disabled
  submitBtn.disabled = !isFormValid();
}


// ---------- 5. Events ----------
nameInput.addEventListener("input", function () {
  checkName();
  updateSubmitButton();
});
nameInput.addEventListener("blur", checkName);

ageInput.addEventListener("input", function () {
  checkAge();
  updateSubmitButton();
});
ageInput.addEventListener("blur", checkAge);

emailInput.addEventListener("input", function () {
  checkEmail();
  updateSubmitButton();
});
emailInput.addEventListener("blur", checkEmail);

passwordInput.addEventListener("input", function () {
  checkPassword();
  updateSubmitButton();
});
passwordInput.addEventListener("blur", checkPassword);

bioInput.addEventListener("input", function () {
  updateBioCounter();
  checkBio();
  updateSubmitButton();
});
bioInput.addEventListener("blur", checkBio);

const genderInputs = document.querySelectorAll('input[name="gender"]');
for (let i = 0; i < genderInputs.length; i++) {
  genderInputs[i].addEventListener("change", function () {
    checkGender();
    updateSubmitButton();
  });
}


// ---------- 6. Submit + table ----------
function updateEmptyText() {
  if (studentTableBody.rows.length === 0) {
    emptyText.classList.remove("hidden");
  } else {
    emptyText.classList.add("hidden");
  }
}

function addStudentRow(name, age, gender, email, bio) {
  const row = document.createElement("tr");

  const nameCell = document.createElement("td");
  nameCell.textContent = name;

  const ageCell = document.createElement("td");
  ageCell.textContent = age;

  const genderCell = document.createElement("td");
  genderCell.textContent = gender;

  const emailCell = document.createElement("td");
  emailCell.textContent = email;

  const bioCell = document.createElement("td");
  bioCell.textContent = bio;

  const actionCell = document.createElement("td");
  const deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.className = "delete-btn";
  deleteBtn.textContent = "Delete";

  deleteBtn.addEventListener("click", function () {
    row.remove();
    updateEmptyText();
  });

  actionCell.appendChild(deleteBtn);

  row.appendChild(nameCell);
  row.appendChild(ageCell);
  row.appendChild(genderCell);
  row.appendChild(emailCell);
  row.appendChild(bioCell);
  row.appendChild(actionCell);

  studentTableBody.appendChild(row);
  updateEmptyText();
}


function clearFieldStyles() {
  const inputs = [nameInput, ageInput, emailInput, passwordInput, bioInput];

  for (let i = 0; i < inputs.length; i++) {
    inputs[i].classList.remove("valid", "invalid");
  }

  nameError.textContent = "";
  ageError.textContent = "";
  genderError.textContent = "";
  emailError.textContent = "";
  passwordError.textContent = "";
  bioError.textContent = "";
}

form.addEventListener("submit", function (event) {
  event.preventDefault();

  checkName();
  checkAge();
  checkGender();
  checkEmail();
  checkPassword();
  checkBio();

  if (!isFormValid()) {
    return;
  }

  const userName = nameInput.value.trim();
  const userAge = ageInput.value.trim();
  const userGender = getSelectedGender();
  const userEmail = emailInput.value.trim();
  const userBio = bioInput.value.trim();

  addStudentRow(userName, userAge, userGender, userEmail, userBio);

  popupText.textContent = "Thank you, " + userName + "! Your registration was successful.";
  successPopup.hidden = false;

  form.reset();
  clearFieldStyles();
  updateBioCounter();
  updateSubmitButton();
});

closePopupBtn.addEventListener("click", function () {
  successPopup.hidden = true;
});


// ---------- Start ----------
updateBioCounter();
updateSubmitButton();
updateEmptyText();
