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
  const accountNameDisplay = document.querySelector(".account-name-display");

  signInFeedback.innerHTML = `<p>Submitting sign-in request.</p>`;

  fetch("https://onedevdriver-001-site1.anytempurl.com/api/BasicPaymentsApp/sign-in", {
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
    
    accountNameDisplay.innerHTML = `<span>Account Name: ${data.accountFirstName} ${data.accountMiddleName} ${data.accountLastName}</span>`;
    accountBalanceDisplay.innerHTML = `<span>Account Balance: ₦${data.accountBalance}</span>`;
    accountNumberDisplay.innerHTML = `<span>Account Number: ${data.accountNumber}</span>`;

    transactionContainer.innerHTML = `
        <input class="destination-account-number" type="number" placeholder="Recipient account number">
        <input class="number-input" type="number" placeholder="Enter amount">
        <button class="send-button">Send money</button>
        <p class="feedback-display"></p>`;



    const numberInput = document.querySelector(".number-input");
      const sendButton = document.querySelector(".send-button");
      const feedbackDisplay = document.querySelector(".feedback-display");

    // setTimeout(() => {
    // fetch(`https://localhost:7207/api/BasicPaymentsApp/alert?accountNumber=${activeAccount}`)
    // .then(response => response.json())
    // .then(data => {
    //   if (data) {
    //     console.log(`Alert: You received ₦${data.amount} from ${data.accountFirstName} ${data.accountMiddleName} ${data.accountLastName} on ${data.date}.`);
    //   }else {
    //     console.log("No new credit alert.");
    //   }
    // })
    // .catch(error => console.error("Error fetching notifications.", error));
    // }, 3000);

    const recipientAccountNumber = document.querySelector(".destination-account-number");

  //   function getAccount() {

       

  //     if (recipientAccountNumber.value.length === 10) {
        
  //     fetch(`https://onedevdriver-001-site1.anytempurl.com/api/BasicPaymentsApp/${recipientAccountNumber.value}`)
  //     .then(response => {
  //       if (!response.ok) {
  //         throw new Error(`Server responded with ${response.status}`);
  //       }
  //       return response.json();
  //     })
  //     .then(data => {
  //       feedbackDisplay.innerHTML = `
  //         Account Name: ${data.AccountFirstName} ${data.AccountMiddleName ?? ""} ${data.AccountLastName} <br>
  //         Account Number: ${data.AccountNumber}
  //       `;
  //     })
  //     .catch(error => {
  //       console.error("Could not fetch account:", error);
  //       feedbackDisplay.textContent = "Unable to verify account number.";
  //     });

  //   }
  //   else {
  //     console.log("Account number must be 10 digits.");
  //     feedbackDisplay.textContent = "Account number must be 10 digits.";
  //   }
  // }recipientAccountNumber.oninput = getAccount;
    

    // Send money
    function sendMoney() {
      const activeAccount = activeAccounts[0];
        const destinationAccountNumber = document.querySelector(".destination-account-number");
        const amount = parseInt(numberInput.value);

        feedbackDisplay.innerHTML = `Send <span>₦${amount}</span> to <br>
              <span>Account Number: ${destinationAccountNumber.value}</span> <br>
              <input id="confirm-txn-password-input" type="password" placeholder="Enter your password"><button id="confirm-txn-button">Confirm</button>
              <button id="deny-txn-button">Deny</button>`;
        
        const confirmTxnPassword = document.getElementById("confirm-txn-password-input");
        const confirmTxnButton = document.getElementById("confirm-txn-button");
        const confirmNo = document.getElementById("deny-txn-button");

        // Confirm send
        function confirmTxn() {
          // Disable button to prevent multiple clicks
          confirmTxnButton.disabled = true;

          fetch("https://onedevdriver-001-site1.anytempurl.com/api/BasicPaymentsApp/send-money", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json"
              },
              body: JSON.stringify({
                  SenderPhoneNumber: activeAccount,
                  ReceiverAccountNumber: destinationAccountNumber.value,
                  Amount: amount,
                  SenderPassword: confirmTxnPassword.value
              })
          })
          .then(async response => {
              // Attempt to parse JSON, even on error responses
              let data;
              try {
                  data = await response.json();
              } catch (err) {
                  throw new Error("Invalid server response");
              }

              // Handle HTTP status codes
              if (!response.ok) {
                  // Display message from server if available
                  feedbackDisplay.textContent = data?.message || "Transaction failed!";
                  // Update account balance if included
                  if (data?.data?.accountBalance !== undefined) {
                      accountBalanceDisplay.innerHTML = `<span>Account Balance: ₦${data.data.accountBalance}</span>`;
                  }
                  throw new Error(data?.message || "Transaction failed");
              }

              // Success case
              feedbackDisplay.textContent = data.message || `Transaction successfully sent to ${data.receiver.accountMiddleName}` || ` ${data.receiver.AccountMiddleName}`;
              if (data?.accountBalance !== undefined) {
                  accountBalanceDisplay.innerHTML = `<span>Account Balance: ₦${data.accountBalance}</span>`;
              } else if (data?.data?.accountBalance !== undefined) {
                  // fallback for API returning data inside 'data'
                  accountBalanceDisplay.innerHTML = `<span>Account Balance: ₦${data.data.accountBalance}</span>`;
              }

              console.log("Transaction response:", data);
          })
          .catch(error => {
              console.error("Transaction error:", error);
              if (!feedbackDisplay.textContent) {
                  feedbackDisplay.textContent = error.message || "Network or server error!";
              }
          })
          .finally(() => {
              // Re-enable button after transaction attempt
              confirmTxnButton.disabled = false;
          });
        }

      // Bind to button
      confirmTxnButton.onclick = confirmTxn;



        // Deny send
        function denyTxn() {
        feedbackDisplay.textContent = "Transaction cancelled!";
        }confirmNo.onclick = denyTxn;

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

  fetch(`https://onedevdriver-001-site1.anytempurl.com/api/BasicPaymentsApp/sign-out`, {
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
  
  setTimeout(()=>{
     window.location.reload();
   }, 1500);
  
} 
