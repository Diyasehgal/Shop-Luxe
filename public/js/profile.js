// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', () => {
    // Attach the logout function to the logout button
    const logoutButton = document.getElementById('logout-btn');

    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    } else {
        console.error('Logout button not found.');
    }

    // Fetch and display user profile data
    fetchUserProfile();
});

// Function to log out the user
function logout() {
    // Clear the token cookie by setting it with an expired date
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    console.log('User logged out.'); // Debugging

    // Redirect to the home page
    window.location.href = '/';
}

// Function to fetch and display user profile data
async function fetchUserProfile() {
    const emailSpan = document.getElementById('user-email');

    try {
        // Get the token from cookies
        const cookies = document.cookie.split(';');
        const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));

        if (!tokenCookie) {
            console.error('No token found. User not logged in.');
            window.location.href = '/html/login.html';
            return;
        }

        const token = tokenCookie.split('=')[1];

        // Fetch user profile data from the server
        const response = await fetch('/auth/profile', {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch profile data');
        }

        const data = await response.json();
        console.log('Profile data:', data);

        // Update the email in the DOM
        emailSpan.textContent = data.email;
    } catch (error) {
        console.error(error.message);
        alert('Failed to load profile data. Please log in again.');
        window.location.href = '/html/login.html'; // Redirect to login
    }
}