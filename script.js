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


function signUp() {

  let signUpDetails = {
    signUpFirstName: firstNameInput.value,
    signUpMiddleName: middleNameInput.value,
    signUpLastName: lastNameInput.value,
    signUpPhoneNumber: phoneNumberInput.value,
    signUpPassword: passwordInput.value,
    
  };

  if (signUpDetails.signUpFirstName.trim() !== "" && signUpDetails.signUpLastName.trim() !== "" && signUpDetails.signUpPassword.trim() !== "" && signUpDetails.signUpPhoneNumber.trim() !== "" && signUpDetails.signUpPhoneNumber.length === 11 && !isNaN(signUpDetails.signUpPhoneNumber) && confirmPasswordInput.value.trim() !== "" && confirmPasswordInput.value.trim() === signUpDetails.signUpPassword.trim()) {
     
    signUpFeedback.textContent = `Submitting sign-up request, dear ${signUpDetails.signUpFirstName}`;

      fetch("https://onedevdriver-001-site1.anytempurl.com/api/BasicPaymentsApp/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(signUpDetails)
      })
      .then(response => {
        if (!response.ok) {
          return response.text().then(errorMessage => {
            throw new Error(errorMessage || "Sign-up failed!");
          });
        }
        return response.json();
      })
      .then(data => {
        console.log("Sign-up successful:", data);
        signUpFeedback.innerHTML = `Sign up successful, dear ${data.accountFirstName}`;
      })
      .catch(error => {
        signUpFeedback.innerHTML = `Phone number <strong>${signUpDetails.signUpPhoneNumber}</strong> already used.<br> Kindly register with another phone number. Thank you.`;
        console.error(error);
      });

      formField.style.display = "none";
      signUpHeader.style.display = "none"; 
  
  } else {
    signUpFeedback.textContent = "Invalid sign-up credentials.";
  }

} signUpButton.onclick = signUp;