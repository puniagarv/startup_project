function attachSignupListener() {
    if (!window.signupScriptLoaded) {
        window.signupScriptLoaded = true;

        function initializeForm() {
            const form = document.getElementById("signupForm");
            if (!form) return; // Ensure form exists

            const dobInput = form.querySelector("input[name='dob']");
            const mobileInput = form.querySelector("input[name='phoneNumber']");
            const passwordInput = form.querySelector('input[name="password"]');
            const confirmPasswordInput = form.querySelector('input[name="confirmPassword"]');

            // Function to remove previous error messages
            function clearErrorMessages(className) {
                const existingError = form.querySelector(`.${className}`);
                if (existingError) existingError.remove();
            }

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

            function isValidPhoneNumber(phone) {
                return /^[0-9]{10}$/.test(phone);
            }

            function isValidPassword(password) {
                return /^(?=.*[A-Z])(?=.*[@#$%!^&])[A-Za-z0-9@#$%!^&]{6,}$/.test(password);
            }

            function arePasswordsMatching(password, confirmPassword) {
                return password === confirmPassword;
            }

            passwordInput.addEventListener("input", function () {
                clearErrorMessages('password-strength-error');
                if (!isValidPassword(passwordInput.value)) {
                    const passwordStrengthError = document.createElement("div");
                    passwordStrengthError.textContent = "Password must contain at least one uppercase letter and one special character (@, #, $, %, !).";
                    passwordStrengthError.className = "password-strength-error";
                    passwordStrengthError.style.color = "red";
                    passwordStrengthError.style.fontSize = "12px";
                    passwordInput.parentElement.appendChild(passwordStrengthError);
                }
            });

            confirmPasswordInput.addEventListener("input", function () {
                clearErrorMessages('password-match-error');
                if (!arePasswordsMatching(passwordInput.value, confirmPasswordInput.value)) {
                    const passwordMatchError = document.createElement("div");
                    passwordMatchError.textContent = "Passwords do not match.";
                    passwordMatchError.className = "password-match-error";
                    passwordMatchError.style.color = "red";
                    passwordMatchError.style.fontSize = "12px";
                    confirmPasswordInput.parentElement.appendChild(passwordMatchError);
                }
            });

            form.addEventListener("submit", async function (event) {
                event.preventDefault();
                let isValid = true;

                clearErrorMessages('dob-error');
                clearErrorMessages('mobile-error');
                clearErrorMessages('password-strength-error');
                clearErrorMessages('password-match-error');
                clearErrorMessages('email-error');

                if (!isAgeValid(dobInput.value)) {
                    isValid = false;
                    const dobError = document.createElement("div");
                    dobError.textContent = "You must be at least 18 years old.";
                    dobError.className = "dob-error";
                    dobError.style.color = "red";
                    dobError.style.fontSize = "12px";
                    dobInput.parentElement.appendChild(dobError);
                }

                if (!isValidPhoneNumber(mobileInput.value)) {
                    isValid = false;
                    const mobileError = document.createElement("div");
                    mobileError.textContent = "Please enter a valid 10-digit mobile number.";
                    mobileError.className = "mobile-error";
                    mobileError.style.color = "red";
                    mobileError.style.fontSize = "12px";
                    mobileInput.parentElement.appendChild(mobileError);
                }

                if (!isValidPassword(passwordInput.value)) {
                    isValid = false;
                    const passwordStrengthError = document.createElement("div");
                    passwordStrengthError.textContent = "Password must contain at least one uppercase letter and one special character (@, #, $, %, !).";
                    passwordStrengthError.className = "password-strength-error";
                    passwordStrengthError.style.color = "red";
                    passwordStrengthError.style.fontSize = "12px";
                    passwordInput.parentElement.appendChild(passwordStrengthError);
                }

                if (!arePasswordsMatching(passwordInput.value, confirmPasswordInput.value)) {
                    isValid = false;
                    const passwordMatchError = document.createElement("div");
                    passwordMatchError.textContent = "Passwords do not match.";
                    passwordMatchError.className = "password-match-error";
                    passwordMatchError.style.color = "red";
                    passwordMatchError.style.fontSize = "12px";
                    confirmPasswordInput.parentElement.appendChild(passwordMatchError);
                }

                if (!isValid) return;

                const formData = new FormData(this);
                let jsonData = {};
                formData.forEach((value, key) => jsonData[key] = value);

                try {
                    const response = await fetch("http://localhost:8080/register", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(jsonData)
                    });

                    const contentType = response.headers.get("content-type");
                    let responseData = contentType && contentType.includes("application/json") ? await response.json() : await response.text();

                    if (response.ok) {
                        window.location.href = "/html/success.html"; 
                    } else {
                        if (response.status === 409) {
                            const emailInput = form.querySelector("input[name='emailId']");
                            const emailErrorElement = document.createElement("div");
                            emailErrorElement.textContent = "Email already registered. Please login.";
                            emailErrorElement.className = "email-error";
                            emailErrorElement.style.color = "red";
                            emailErrorElement.style.fontSize = "12px";
                            emailInput.parentElement.appendChild(emailErrorElement);
                        } else {
                            window.location.href = "/html/internalserver.html";
                        }
                    }
                } catch (error) {
                    console.error("⚠️ Fetch Error:", error);
                    window.location.href = "/html/internalserver.html";
                }
            });
        }

        // Run the function immediately if DOM is already loaded
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", initializeForm);
        } else {
            initializeForm();
        }
    }
}

// Attach event listener with the correct function
setTimeout(() => {
    console.log("🔍 Checking if signup button exists...");
    if (document.getElementById("signup-button")) {
        attachSignupListener();
    } else {
        console.error("❌ SignupButton not found, event listener not attached.");
    }
}, 200);
