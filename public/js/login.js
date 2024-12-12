document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async function (event) {
            event.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('http://localhost:3000/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                });

                if (response.ok) {
                    const result = await response.json();
                    document.cookie = `token=${result.token}; path=/`;
                
                    // Force reload the home page to update navigation
                    window.location.href = '/';
                    window.location.reload(true);
                } else {
                    const error = await response.json();
                    alert(error.message || 'Login failed.');
                }
            } catch (error) {
                console.error('Error logging in:', error);
                alert('Something went wrong. Please try again.');
            }
        });
    } else {
        console.error('Login form not found!');
    }
});