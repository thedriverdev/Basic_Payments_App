// Sign in

const signInHeader = document.getElementById("sign-in-header");
const nameInput = document.querySelector(".name-input");
const passwordInput = document.querySelector(".password-input");
const signInButton = document.querySelector(".sign-in-button");
const signInFeedback = document.querySelector(".sign-in-feedback");
const userAccountInfo = document.querySelector(".user-account-info");
const transactionContainer = document.querySelector(".transaction-container");

signInHeader.textContent = "Sign in to Moola.com";

function signIn() {

  let availableAccounts = JSON.parse(localStorage.getItem("availableAccounts"));

  let matchedUser = availableAccounts.find((userDetails) => { return nameInput.value === userDetails.userName && passwordInput.value === userDetails.userPassword});

  if (matchedUser) {

    signInHeader.style.display = "none";
    
    signInFeedback.innerHTML = `Sign in successful!
    Welcome, ${matchedUser.userName}! <button class="sign-out-button" onclick="signOut();">Sign out</button>`;

    localStorage.setItem("loggedInUser", matchedUser.userName);

    nameInput.style.display = "none";
    passwordInput.style.display = "none";
    signInButton.style.display = "none";

    userAccountInfo.innerHTML = `<img src="default.jpeg" alt="Profile photo of ${matchedUser.userName}" /><br>`;

    transactionContainer.innerHTML = `
        <input class="destination-account-name" type="text" placeholder="Enter name of recepient">
        <input class="number-input" type="number" placeholder="Enter amount">
        <button class="send-button">Send money</button>
        <p class="feedback-display"></p>`;

        const accountBalanceDisplay = document.querySelector(".account-balance-display");
        const accountNumberDisplay = document.querySelector(".account-number-display");
        const destinationAccountName = document.querySelector(".destination-account-name");

        accountBalanceDisplay.innerHTML = `Account Balance: ₦${parseInt(matchedUser.userBalance)}`;
        accountNumberDisplay.innerHTML = `Account Number: ${matchedUser.userAccount}`;

        const numberInput = document.querySelector(".number-input");
        const sendButton = document.querySelector(".send-button");
        const feedbackDisplay = document.querySelector(".feedback-display");


        function sendMoney() {

          const amount = parseInt(numberInput.value);

          let matchedDestination = availableAccounts.find((availableAccount)=>{return availableAccount.userName === destinationAccountName.value});

          if (matchedDestination) {
            
            if (!isNaN(amount) && amount > 0 && amount) {

              if (destinationAccountName.value === matchedUser.userName) {
                feedbackDisplay.textContent = "Cannot send to origination account.";
              } else {

                if (!isNaN(amount) && amount > matchedUser.userBalance) {
                  feedbackDisplay.textContent = "Insufficient funds!";
                } else {
                  matchedUser.userBalance = parseInt(matchedUser.userBalance) - amount;
                  matchedDestination.userBalance = parseInt(matchedDestination.userBalance) + amount;
                  localStorage.setItem("availableAccounts", JSON.stringify(availableAccounts));
                  feedbackDisplay.innerHTML = `<span>₦${amount}</span> sent to
                  <span>Name: ${matchedDestination.userName} | Account Number: ${matchedDestination.userAccount}</span>`;
                  numberInput.value = "";
                  destinationAccountName.value = "";
      
                  accountBalanceDisplay.innerHTML = `<span>Your Account Balance: ₦${matchedUser.userBalance}</span>`;
                  accountNumberDisplay.innerHTML = `<span>Your Account Number: ${matchedUser.userAccount}</span>`;
                }

              }

            } else {
              feedbackDisplay.textContent = "Amount not enough.";
              accountBalanceDisplay.innerHTML = `<span>Account Balance: ₦${matchedUser.userBalance}</span>`;
            }

          
          } else {
            feedbackDisplay.textContent = "Destination account not found.";
          }


        } sendButton.onclick = sendMoney;

  } else {
    signInFeedback.textContent = "Account does not exist!";
  }

}signInButton.onclick = signIn;

const signOutFeedback = document.querySelector(".sign-out-feedback");

function signOut() {
  localStorage.removeItem("loggedInUser");
  signInFeedback.textContent = "";
  userAccountInfo.innerHTML = "";
  transactionContainer.innerHTML = "You signed out successfully!";
  
  setTimeout(()=>{
    window.location.reload();
  }, 1500);
  
}