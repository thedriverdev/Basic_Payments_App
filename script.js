const nameInput = document.querySelector(".name-input");
const passwordInput = document.querySelector(".password-input");
const confirmPasswordInput = document.querySelector(".confirm-password-input");
const signUpButton = document.querySelector(".sign-up-button");
const signUpFeedback = document.querySelector(".sign-up-feedback");
const numOfAccountsDisplay = document.querySelector(".num-of-accounts");

let availableAccounts = JSON.parse(localStorage.getItem("availableAccounts")) || [];

function signUp() {

  let userDetails = {
    userName: nameInput.value,
    userPassword: passwordInput.value,
    userBalance: 0,
    userAccount: Math.floor(Math.random() * 9000) + 1000
  };

  if (userDetails.userName.trim() !== "" && userDetails.userPassword !== "" && confirmPasswordInput.value !== "" && confirmPasswordInput.value === userDetails.userPassword) {

    if (availableAccounts.find((availableAccount)=>{return availableAccount.userName === userDetails.userName})) {
      signUpFeedback.textContent = "Username already taken!";
    } else {

      if (userDetails.userName === "Alfie") {
        userDetails.userBalance = 1000000;
        availableAccounts.push(userDetails);
        localStorage.setItem("availableAccounts", JSON.stringify(availableAccounts));
        localStorage.setItem("numOfAccounts", availableAccounts.length);
  
        nameInput.value = "";
        passwordInput.value = "";
        confirmPasswordInput.value = "";
        let numOfAccounts = localStorage.getItem("numOfAccounts");
        numOfAccountsDisplay.textContent = `Number of available accounts: ${numOfAccounts}`;
  
        signUpFeedback.textContent = `Sign up successful, ${userDetails.userName}`;
      } else {
        availableAccounts.push(userDetails);
        localStorage.setItem("availableAccounts", JSON.stringify(availableAccounts));
        localStorage.setItem("numOfAccounts", availableAccounts.length);
  
        nameInput.value = "";
        passwordInput.value = "";
        confirmPasswordInput.value = "";
        let numOfAccounts = localStorage.getItem("numOfAccounts");
        numOfAccountsDisplay.textContent = `Number of available accounts: ${numOfAccounts}`;
  
        signUpFeedback.textContent = `Sign up successful, ${userDetails.userName}`;
      }

    }

    
  } else {
    signUpFeedback.textContent = "Make sure you have entered a name, and your passwords match.";
  }

} signUpButton.onclick = signUp;