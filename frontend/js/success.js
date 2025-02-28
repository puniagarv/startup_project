document.addEventListener('DOMContentLoaded', function() {
    const messageElement = document.getElementById('message');
    
    // Assuming the message is passed via query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const message = urlParams.get('message') || 'Success!  Please, check your email for to complete your registration';

    messageElement.textContent = message;
});