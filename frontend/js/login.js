function attachLoginListener() {
    const loginButton = document.getElementById('loginButton');
    const errorMessage = document.getElementById('message');

    if (!loginButton || !errorMessage) {
        console.error('❌ loginButton or errorMessage not found in DOM.');
        return;
    }

    loginButton.addEventListener('click', function (event) {
        event.preventDefault();
        console.log("✅ Login button clicked!");

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        if (!username || !password) {
            errorMessage.innerText = '⚠ Email and password are required!';
            errorMessage.style.display = 'block';
            errorMessage.style.color = 'red';
            return;
        }

        console.log(username, password);
        fetch('https://startup-project-40wn.onrender.com/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ emailId: username, password })
        })
        .then(async response => {
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Login failed");
            }
            return response.json();
        })
        .then(data => {
            if (data.jwtToken) {
                localStorage.setItem("jwtToken", data.jwtToken);
                window.location.href = "/html/dashboard.html";
            } else {
                throw new Error("Token not received from server");
            }
        })
        .catch(error => {
            errorMessage.innerText = `${error.message}`;
            errorMessage.style.display = 'block';
            errorMessage.style.color = 'red';
        });
    });

    console.log("✅ Login event listener attached!");
}

// Function to attach event listener for register button
function attachRegisterListener() {
    const registerButton = document.getElementById("showRegister");
    console.log("🔍 Checking if registerButton exists...");
    if (registerButton) {
        registerButton.addEventListener("click", (event) => {
            event.preventDefault();
            console.log("🔄 Switching to Register Form...");

            if (typeof loadContent === "function") {
                loadContent('/html/signup.html', event);
            } else {
                console.error("❌ loadContent function is not available.");
            }
        });
        console.log("✅ Register event listener attached!");
    } else {
        console.error("❌ registerButton not found in DOM.");
    }
}

// Delay attaching the event listeners after `login.html` is inserted
setTimeout(() => {
    console.log("🔍 Checking if loginButton exists...");
    if (document.getElementById("loginButton")) {
        attachLoginListener();
        attachRegisterListener(); // Attach register button listener
    } else {
        console.error("❌ loginButton not found, event listener not attached.");
    }
}, 200);
