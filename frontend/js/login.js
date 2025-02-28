document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('message');
    const logoutMessage = document.getElementById('logout-message'); // Now correctly referenced

    if (!loginForm || !errorMessage || !logoutMessage) {
        console.error('Required elements are missing in the HTML.');
        return;
    }

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();

        // Get input values
        const emailId = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        // Validate fields
        if (!username || !password) {
            errorMessage.innerText = 'Email and password are required!';
            errorMessage.style.display = 'block';
            logoutMessage.style.display = 'none';
            return;
        }

        // Hide previous errors and messages
        errorMessage.style.display = 'none';
        logoutMessage.style.display = 'none';

        fetch('http://localhost:8080/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ emailId, password })
        })
        .then(async response => {
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Login failed");
            }
            return response.json();
        })
        .then(data => {
            console.log('Response:', data);
            
            // ✅ Store token in localStorage
            if (data.jwtToken) {
                localStorage.setItem("jwtToken", data.jwtToken);
                console.log("Token stored successfully:", data.jwtToken);
            } else {
                throw new Error("Token not received from server");
            }
        
            // ✅ Redirect to the dashboard if login is successful
            window.location.href = "/html/dashboard.html";
        })
        .catch(error => {
            errorMessage.innerText = error.message || 'Something went wrong. Please try again later.';
            errorMessage.style.display = 'block';
        });
        
        
    });

    // Display logout message if the URL contains "?logout"

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('logout')) {
        logoutMessage.innerText = 'You have been logged out successfully.';
        logoutMessage.style.display = 'block';
    }


});
