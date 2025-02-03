const form = document.getElementById("signupForm");
const dobInput = form.querySelector("input[name='dob']");
const mobileInput = form.querySelector("input[name='mobile']");
const dobErrorElement = document.createElement("div");
const mobileErrorElement = document.createElement("div");

// Function to calculate age and check if user is 18 or older
function isAgeValid(dob) {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age >= 18;
}

// Function to validate phone number (basic check for format)
function isValidPhoneNumber(phone) {
    const phonePattern = /^[0-9]{10}$/; // Basic pattern for 10-digit phone number
    return phonePattern.test(phone);
}

// Function to validate password (check for uppercase and special character)
function isValidPassword(password) {
    const passwordPattern = /^(?=.*[A-Z])(?=.*[@#$%!^&])[A-Za-z0-9@#$%!^&]{6,}$/;
    // The regex checks for at least one uppercase letter and one special character
    return passwordPattern.test(password);
}

// Function to validate password match
function arePasswordsMatching(password, confirmPassword) {
    return password === confirmPassword;
}

// Event listener for password input to provide real-time feedback
const passwordInput = form.querySelector('input[name="password"]');
const confirmPasswordInput = form.querySelector('input[name="confirmPassword"]');
const passwordStrengthError = document.createElement("div");
const passwordMatchError = document.createElement("div");

passwordInput.addEventListener("input", function() {
    // Remove any existing error messages for password strength and password match
    const existingPasswordStrengthError = form.querySelector('.password-strength-error');
    if (existingPasswordStrengthError) {
        existingPasswordStrengthError.remove();
    }

    // Check password strength (uppercase and special character)
    if (!isValidPassword(passwordInput.value)) {
        passwordStrengthError.textContent = "Password must contain at least one uppercase letter and one special character (@, #, $, %, !).";
        passwordStrengthError.style.color = "red";
        passwordStrengthError.style.fontSize = "12px";
        passwordStrengthError.classList.add('password-strength-error');
        passwordInput.parentElement.appendChild(passwordStrengthError);
    }
});

// Event listener for confirm password input to provide real-time feedback
confirmPasswordInput.addEventListener("input", function() {
    // Remove any existing error messages
    const existingPasswordMatchError = form.querySelector('.password-match-error');
    if (existingPasswordMatchError) {
        existingPasswordMatchError.remove();
    }

    // Check if passwords match
    if (!arePasswordsMatching(passwordInput.value, confirmPasswordInput.value)) {
        passwordMatchError.textContent = "Passwords do not match.";
        passwordMatchError.style.color = "red";
        passwordMatchError.style.fontSize = "12px";
        passwordMatchError.classList.add('password-match-error');
        confirmPasswordInput.parentElement.appendChild(passwordMatchError);
    }
});

// Event listener for form submission
form.addEventListener("submit", function(event) {
    let isValid = true;

    // Clear any previous error messages
    const existingDobError = form.querySelector('.dob-error');
    if (existingDobError) {
        existingDobError.remove();
    }

    // Validate Date of Birth (DOB)
    const dob = dobInput.value; // Get the Date of Birth value
    if (!isAgeValid(dob)) {
        isValid = false;
        dobErrorElement.textContent = "You must be at least 18 years old.";
        dobErrorElement.style.color = "red";
        dobErrorElement.style.fontSize = "12px";
        dobErrorElement.classList.add('dob-error'); // Add a class for easy identification
        dobInput.parentElement.appendChild(dobErrorElement); // Display error next to DOB input
    }

    // Clear existing mobile error
    const existingMobileError = form.querySelector('.mobile-error');
    if (existingMobileError) {
        existingMobileError.remove();
    }

    // Validate phone number
    const mobile = mobileInput.value; // Get the Mobile Number value
    if (!isValidPhoneNumber(mobile)) {
        isValid = false;
        mobileErrorElement.textContent = "Please enter a valid 10-digit mobile number.";
        mobileErrorElement.style.color = "red";
        mobileErrorElement.style.fontSize = "12px";
        mobileErrorElement.classList.add('mobile-error'); // Add a class for easy identification
        mobileInput.parentElement.appendChild(mobileErrorElement); // Append error under mobile input
    }

    // Validate password and confirm password
    if (!isValidPassword(passwordInput.value)) {
        isValid = false;
        passwordStrengthError.textContent = "Password must contain at least one uppercase letter and one special character (@, #, $, %, !).";
        passwordStrengthError.style.color = "red";
        passwordStrengthError.style.fontSize = "12px";
        passwordStrengthError.classList.add('password-strength-error');
        passwordInput.parentElement.appendChild(passwordStrengthError);
    }

    if (!arePasswordsMatching(passwordInput.value, confirmPasswordInput.value)) {
        isValid = false;
        passwordMatchError.textContent = "Passwords do not match.";
        passwordMatchError.style.color = "red";
        passwordMatchError.style.fontSize = "12px";
        passwordMatchError.classList.add('password-match-error');
        confirmPasswordInput.parentElement.appendChild(passwordMatchError);
    }

    // If the form is not valid, prevent submission
    if (!isValid) {
        event.preventDefault(); // Prevent the form from submitting
    }
});
