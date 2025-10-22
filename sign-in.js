// Sign in
const signInHeader = document.getElementById("sign-in-header");
const phoneNumberInput = document.querySelector(".phone-number-input");
const passwordInput = document.querySelector(".password-input");
const signInButton = document.querySelector(".sign-in-button");
const signInFeedback = document.querySelector(".sign-in-feedback");
const userAccountInfo = document.querySelector(".user-account-info");
const transactionContainer = document.querySelector(".transaction-container");
const signInContainer = document.querySelector(".sign-in-container");
const signUpNotif = document.getElementById("sign-up-notif");


signInHeader.innerHTML = `Sign in to your Basic Payments account!`;

let activeAccounts = [];

function signIn() {

  const accountBalanceDisplay = document.querySelector(".account-balance-display");
  const accountNumberDisplay = document.querySelector(".account-number-display");

  signInFeedback.innerHTML = `<p>Submitting sign-in request.</p>`;

  fetch("https://localhost:7207/api/BasicPaymentsApp/sign-in", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      SignInPhoneNumber: phoneNumberInput.value,
      SignInPassword: passwordInput.value
    })
  })
  .then(response => {
    if (!response.ok) {
      signInHeader.innerHTML = `Something went wrong!`;
      throw new Error("Something went wrong!");
      
    }
    return response.json();
  })
  .then(data => {
    activeAccounts.push(phoneNumberInput.value);

    console.log("Signed in successfully!");
    console.log("Account data:", data);
    signInFeedback.innerHTML = `Signed in successfully, <strong>${data.accountFirstName}</strong> <button class="sign-out-button" onclick="signOut();">Sign out</button>`;
    signInHeader.style.display = "none";
    phoneNumberInput.style.display = "none";
    passwordInput.style.display = "none";
    signInButton.style.display = "none";
    signInContainer.style.display = "none";
    signUpNotif.style.display = "none";
    accountBalanceDisplay.innerHTML = `<span>Account Balance: ₦${data.accountBalance}</span>`;
    accountNumberDisplay.innerHTML = `<span>Account Number: ${data.accountNumber}</span>`;

    transactionContainer.innerHTML = `
        <input class="destination-account-number" type="text" placeholder="Recipient account number">
        <input class="number-input" type="number" placeholder="Enter amount">
        <button class="send-button">Send money</button>
        <p class="feedback-display"></p>`;



    const numberInput = document.querySelector(".number-input");
      const sendButton = document.querySelector(".send-button");
      const feedbackDisplay = document.querySelector(".feedback-display");

    // Send money
    function sendMoney() {
      const activeAccount = activeAccounts[0];
        const destinationAccountNumber = document.querySelector(".destination-account-number");
        const amount = parseInt(numberInput.value);

        fetch("https://localhost:7207/api/BasicPaymentsApp/send-money", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
              SenderPhoneNumber : activeAccount,
              ReceiverAccountNumber: destinationAccountNumber.value,
              Amount: amount,
              //TransactionPassword: passwordInput.value
            })
        })
        .then(response => {

            return response.json();
        })
        .then(data => {
            console.log("Transaction successful");
            console.log(data);
            accountBalanceDisplay.innerHTML = `<span>Account Balance: ₦${data.accountBalance}</span>`;
        })
        .catch(error => {
            console.error(error);
            feedbackDisplay.textContent = "Insufficient funds.";
        });

    }sendButton.onclick = sendMoney;

    userAccountInfo.innerHTML = `<div></div>`;
  })
  .catch(error => {
    console.error("Error:", error);
  });
}
signInButton.onclick = signIn;


const signOutFeedback = document.querySelector(".sign-out-feedback");


function signOut() {
  const accountBalanceDisplay = document.querySelector(".account-balance-display");
  const accountNumberDisplay = document.querySelector(".account-number-display");

  const activeAccount = activeAccounts[0];

  fetch(`https://localhost:7207/api/BasicPaymentsApp/sign-out`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      SignOutPhoneNumber: activeAccount
    })
  })
  .then(response => response.json())
  .then(data => {
    console.log(data.message);
    accountBalanceDisplay.style.display = "none";
    accountNumberDisplay.style.display = "none";
    signInFeedback.textContent = "";
    userAccountInfo.innerHTML = "";
    transactionContainer.innerHTML = "You signed out successfully!";
  })
  .catch(error => {
    console.error("Error signing out:", error);
  });
  
  // setTimeout(()=>{
  //   window.location.reload();
  // }, 1500);
  
} 
