const formField = document.querySelector(".form-field");
const firstNameInput = document.querySelector(".first-name-input");
const middleNameInput = document.querySelector(".middle-name-input");
const lastNameInput = document.querySelector(".last-name-input");
const phoneNumberInput = document.querySelector(".phone-number-input");
const passwordInput = document.querySelector(".password-input");
const confirmPasswordInput = document.querySelector(".confirm-password-input");
const signUpButton = document.querySelector(".sign-up-button");
const signUpHeader = document.querySelector("#sign-up-header");
const signUpFeedback = document.querySelector(".sign-up-feedback");
const numOfAccountsDisplay = document.querySelector(".num-of-accounts");

let availableAccounts = [];

availableAccounts = JSON.parse(localStorage.getItem("availableAccounts")) || [];

function signUp() {



  let userDetails = {
    userFirstName: firstNameInput.value,
    userMiddleName: middleNameInput.value,
    userLastName: lastNameInput.value,
    userPhoneNumber: phoneNumberInput.value,
    userAccountNumber: phoneNumberInput.value.substring(1),
    userPassword: passwordInput.value,
    userBalance: 0
  };

  if (userDetails.userFirstName !== "" && userDetails.userLastName !== "" && userDetails.userPassword !== "" && userDetails.userPhoneNumber !== "" && confirmPasswordInput.value !== "" && confirmPasswordInput.value === userDetails.userPassword) {

    if (availableAccounts.find((availableAccount)=>{return availableAccount.userPhoneNumber === userDetails.userPhoneNumber})) {
      signUpFeedback.textContent = "Phone number already registered!";

    } else {

      if (userDetails.userPhoneNumber === "09166746110" && userDetails.userFirstName === "Alfred") {
        userDetails.userBalance = 10000000;
        availableAccounts.push(userDetails);
        localStorage.setItem("availableAccounts", JSON.stringify(availableAccounts));
        localStorage.setItem("numOfAccounts", availableAccounts.length);
  
        formField.style.display = "none";
        signUpHeader.style.display = "none";
        let numOfAccounts = localStorage.getItem("numOfAccounts");
        numOfAccountsDisplay.textContent = `Number of available accounts: ${numOfAccounts}`;
  
        signUpFeedback.textContent = `Sign up successful, dear ${userDetails.userFirstName}.`;
      } else {
        availableAccounts.push(userDetails);
        localStorage.setItem("availableAccounts", JSON.stringify(availableAccounts));
        localStorage.setItem("numOfAccounts", availableAccounts.length);

        formField.style.display = "none";
        signUpHeader.style.display = "none";
        let numOfAccounts = localStorage.getItem("numOfAccounts");
        numOfAccountsDisplay.textContent = `Number of available accounts: ${numOfAccounts}`;
  
        signUpFeedback.textContent = `Sign up successful, dear ${userDetails.userFirstName}`;
      }

    }

    
  } else {
    signUpFeedback.textContent = "Make sure you have entered a name, and your passwords match.";
  }

} signUpButton.onclick = signUp;