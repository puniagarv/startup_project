document.addEventListener('DOMContentLoaded', function () {
    const loginButton = document.getElementById('loginButton');
    const errorMessage = document.getElementById('message');

    if (!loginButton || !errorMessage) {
        console.error('Required elements are missing in the HTML.');
        return;
    }

    loginButton.addEventListener('click', function (event) {
        event.preventDefault();

        // Get input values
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        // Validate fields
        if (!username || !password) {
            errorMessage.innerText = '⚠ Email and password are required!';
            errorMessage.style.display = 'block';
            errorMessage.style.color = 'red';
            return;
        }

        // Hide previous errors
        errorMessage.style.display = 'none';

        fetch('https://startup-project-40wn.onrender.com/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
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
            errorMessage.innerText = `❌ ${error.message}`;
            errorMessage.style.display = 'block';
        });
    });
});
