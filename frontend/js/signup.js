const form = document.getElementById("signupForm");
const dobInput = form.querySelector("input[name='dob']");
const mobileInput = form.querySelector("input[name='phoneNumber']");
const passwordInput = form.querySelector('input[name="password"]');
const confirmPasswordInput = form.querySelector('input[name="confirmPassword"]');

const dobErrorElement = document.createElement("div");
const mobileErrorElement = document.createElement("div");
const passwordStrengthError = document.createElement("div");
const passwordMatchError = document.createElement("div");

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
    return passwordPattern.test(password);
}

// Function to validate password match
function arePasswordsMatching(password, confirmPassword) {
    return password === confirmPassword;
}

// Real-time password validation
passwordInput.addEventListener("input", function () {
    const existingPasswordStrengthError = form.querySelector('.password-strength-error');
    if (existingPasswordStrengthError) existingPasswordStrengthError.remove();

    if (!isValidPassword(passwordInput.value)) {
        passwordStrengthError.textContent = "Password must contain at least one uppercase letter and one special character (@, #, $, %, !).";
        passwordStrengthError.style.color = "red";
        passwordStrengthError.style.fontSize = "12px";
        passwordStrengthError.classList.add('password-strength-error');
        passwordInput.parentElement.appendChild(passwordStrengthError);
    }
});

confirmPasswordInput.addEventListener("input", function () {
    const existingPasswordMatchError = form.querySelector('.password-match-error');
    if (existingPasswordMatchError) existingPasswordMatchError.remove();

    if (!arePasswordsMatching(passwordInput.value, confirmPasswordInput.value)) {
        passwordMatchError.textContent = "Passwords do not match.";
        passwordMatchError.style.color = "red";
        passwordMatchError.style.fontSize = "12px";
        passwordMatchError.classList.add('password-match-error');
        confirmPasswordInput.parentElement.appendChild(passwordMatchError);
    }
});

// Form submission
document.getElementById("signupForm").addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent actual form submission

    let isValid = true;

    // Clear previous error messages
    const existingDobError = form.querySelector('.dob-error');
    if (existingDobError) existingDobError.remove();

    const existingMobileError = form.querySelector('.mobile-error');
    if (existingMobileError) existingMobileError.remove();

    // Validate Date of Birth (DOB)
    if (!isAgeValid(dobInput.value)) {
        isValid = false;
        dobErrorElement.textContent = "You must be at least 18 years old.";
        dobErrorElement.style.color = "red";
        dobErrorElement.style.fontSize = "12px";
        dobErrorElement.classList.add('dob-error');
        dobInput.parentElement.appendChild(dobErrorElement);
    }

    // Validate phone number
    if (!isValidPhoneNumber(mobileInput.value)) {
        isValid = false;
        mobileErrorElement.textContent = "Please enter a valid 10-digit mobile number.";
        mobileErrorElement.style.color = "red";
        mobileErrorElement.style.fontSize = "12px";
        mobileErrorElement.classList.add('mobile-error');
        mobileInput.parentElement.appendChild(mobileErrorElement);
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

    // If validation fails, stop form submission
    if (!isValid) return;

    // Process form data
    const formData = new FormData(this);
    let jsonData = {};

    console.log("😒 Form Data Reached JS:");

    for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
        jsonData[key] = value;
    }

    try {
        const response = await fetch("http://localhost:8080/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(jsonData)
        });
        

        const contentType = response.headers.get("content-type");
        let responseData;
        if (contentType && contentType.includes("application/json")) {
            responseData = await response.json();
        } else {
            responseData = await response.text();
        }

        if (response.ok) {
            console.log("✅ Success:", responseData);
            window.location.href = "http://127.0.0.1:5500/html/success.html";
        } else {
            if (response.status === 409) {
                const emailInput = form.querySelector("input[name='emailId']");
                const existingEmailError = form.querySelector(".email-error");
                
                // Remove existing error message if any
                if (existingEmailError) existingEmailError.remove();
        
                // Create new error message
                const emailErrorElement = document.createElement("div");
                emailErrorElement.textContent = "Email already registered. Please login.";
                emailErrorElement.style.color = "red";
                emailErrorElement.style.fontSize = "12px";
                emailErrorElement.classList.add("email-error");
        
                // Append error message next to email input
                emailInput.parentElement.appendChild(emailErrorElement);
        
                // ✅ Let the user see the error first, and give them an option to go to login page
            } else {
                console.error("❌ Error:", responseData);
                window.location.href = "http://127.0.0.1:5500/html/internalserver.html";
            }
        }
        
    } catch (error) {
        console.error("⚠️ Fetch Error:", error);
        window.location.href = "http://127.0.0.1:5500/html/internalserver.html";
    }
});
