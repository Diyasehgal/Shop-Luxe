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

    // Fetch and display user orders
    fetchUserOrders();
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

// Function to fetch and display user orders
async function fetchUserOrders() {
    const ordersContainer = document.getElementById('user-orders');

    try {
        const cookies = document.cookie.split(';');
        const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));

        if (!tokenCookie) {
            console.error('No token found. User not logged in.');
            window.location.href = '/html/login.html';
            return;
        }

        const token = tokenCookie.split('=')[1];

        // Fetch user orders from the server
        const response = await fetch('/auth/orders', {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user orders');
        }

        const orders = await response.json();
        console.log('User orders:', orders);

        if (orders.length === 0) {
            ordersContainer.innerHTML = '<p>No orders found.</p>';
            return;
        }

        // Render orders
        ordersContainer.innerHTML = orders.map(order => `
            <div class="order">
                <h2>Order #${order.id}</h2>
                <p><strong>Full Name:</strong> ${order.full_name}</p>
                <p><strong>Email:</strong> ${order.email}</p>
                <p><strong>Address:</strong> ${order.address}, ${order.city}, ${order.state}, ${order.zip}</p>
                <p><strong>Total Price:</strong> $${order.total_price.toFixed(2)}</p>
                <h3>Items:</h3>
                <ul>
                    ${order.items.map(item => `
                        <li>
                            <img src="${item.image_url}" alt="${item.name}" class="item-image">
                            ${item.name} - Quantity: ${item.quantity}, Price: $${item.price.toFixed(2)}
                        </li>
                    `).join('')}
                </ul>
            </div>
        `).join('');
    } catch (error) {
        console.error(error.message);
        ordersContainer.innerHTML = '<p>Failed to load orders. Please try again later.</p>';
    }
}