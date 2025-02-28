document.addEventListener('DOMContentLoaded', (event) => {
    const welcomeMessage = document.getElementById('welcome-message');
    if (welcomeMessage) {
        welcomeMessage.textContent = 'Welcome to the Demo Project!';
    }
});