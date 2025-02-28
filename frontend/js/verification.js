document.addEventListener('DOMContentLoaded', function() {
    const messageElement = document.getElementById('message');
    const redirectUrlElement = document.getElementById('redirectUrl');

    // Assuming the message and redirectUrl are passed via query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const message = urlParams.get('message') || 'Your email has been verified successfully!';
    const redirectUrl = urlParams.get('redirectUrl') || '/login';

    messageElement.textContent = message;
    redirectUrlElement.href = redirectUrl;
});