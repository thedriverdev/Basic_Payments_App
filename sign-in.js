// Sign in

const signInHeader = document.getElementById("sign-in-header");
const phoneNumberInput = document.querySelector(".phone-number-input");
const passwordInput = document.querySelector(".password-input");
const signInButton = document.querySelector(".sign-in-button");
const signInFeedback = document.querySelector(".sign-in-feedback");
const userAccountInfo = document.querySelector(".user-account-info");
const transactionContainer = document.querySelector(".transaction-container");
const signInContainer = document.querySelector(".sign-in-container");

signInHeader.innerHTML = `Sign in to your <i>Moola</i> account!`;

function signIn() {

  let availableAccounts = JSON.parse(localStorage.getItem("availableAccounts"))||[];

  let matchedUser = availableAccounts.find((userDetails) => { return phoneNumberInput.value === userDetails.userPhoneNumber && passwordInput.value === userDetails.userPassword});

  if (matchedUser) {

    signInHeader.style.display = "none";
    
    signInFeedback.innerHTML = `Sign in successful!<br>
    Welcome, ${matchedUser.userFirstName}!  <button class="sign-out-button" onclick="signOut();">Sign out</button>`;

    localStorage.setItem("loggedInUser", matchedUser.userFirstName);

    phoneNumberInput.style.display = "none";
    passwordInput.style.display = "none";
    signInButton.style.display = "none";

    userAccountInfo.innerHTML = `<img src="default.jpeg" alt="Profile photo of ${matchedUser.userFirstName}" />
    <br> <p style="margin-top:0px; margin-bottom: 0px; font-size: 13px; display: inline;"> Upload new photo?
    </p> <input class="image-upload" type="file" name="photo" accept="image/*" multiple>`;
    const imageUpload = document.querySelector(".image-upload");

    transactionContainer.innerHTML = `
        <input class="destination-account-number" type="text" placeholder="Enter account number of recepient">
        <input class="number-input" type="number" placeholder="Enter amount">
        <button class="send-button">Send money</button>
        <p class="feedback-display"></p>`;

        const accountBalanceDisplay = document.querySelector(".account-balance-display");
        const accountNumberDisplay = document.querySelector(".account-number-display");
        const destinationAccountNumber = document.querySelector(".destination-account-number");

        accountBalanceDisplay.innerHTML = `<span>Account Balance: ₦${parseInt(matchedUser.userBalance)}</span>`;
        accountNumberDisplay.innerHTML = `<span>Account Number: ${matchedUser.userAccountNumber}</span>`;

        const numberInput = document.querySelector(".number-input");
        const sendButton = document.querySelector(".send-button");
        const feedbackDisplay = document.querySelector(".feedback-display");

        signInContainer.style.display = "none";


        function sendMoney() {

          const amount = parseInt(numberInput.value);

          let matchedDestination = availableAccounts.find((availableAccount)=>{return availableAccount.userAccountNumber === destinationAccountNumber.value});

          if (matchedDestination) {
            
            if (!isNaN(amount) && amount > 0) {

              if (destinationAccountNumber.value === matchedUser.userAccountNumber) {
                feedbackDisplay.textContent = "Cannot send to origination account.";
              } else {

                if (!isNaN(amount) && amount > matchedUser.userBalance) {
                  feedbackDisplay.textContent = "Insufficient funds!";
                } else {

                  feedbackDisplay.innerHTML = `Send <span>₦${amount}</span> to <br>
                  <span>Name: ${matchedDestination.userFirstName} ${matchedDestination.userMiddleName} ${matchedDestination.userLastName} <br>
                  Account Number: ${matchedDestination.userAccountNumber}</span> <br>
                  <button id="confirm-yes">YES</button>
                  <button id="confirm-no">NO</button>`;
                  const confirmYes = document.getElementById("confirm-yes");
                  const confirmNo = document.getElementById("confirm-no");

                  // Confirm send
                  function confirmSend() {
                    matchedUser.userBalance = parseInt(matchedUser.userBalance) - amount;
                    matchedDestination.userBalance = parseInt(matchedDestination.userBalance) + amount;
                    localStorage.setItem("availableAccounts", JSON.stringify(availableAccounts));
                    feedbackDisplay.innerHTML = `<span>₦${amount}</span> sent to <br>
                    <span>Name: ${matchedDestination.userFirstName} ${matchedDestination.userMiddleName} ${matchedDestination.userLastName}<br>Account Number: ${matchedDestination.userAccountNumber}</span>`;
                    numberInput.value = "";
                    destinationAccountNumber.value = "";
        
                    accountBalanceDisplay.innerHTML = `<span>Your Account Balance: ₦${matchedUser.userBalance}</span>`;
                    accountNumberDisplay.innerHTML = `<span>Your Account Number: ${matchedUser.userAccountNumber}</span>`;
                  }confirmYes.onclick = confirmSend;

                  // Deny send

                  function denySend() {
                    feedbackDisplay.textContent = "Transaction cancelled!";
                  }confirmNo.onclick = denySend;

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