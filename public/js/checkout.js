document.addEventListener('DOMContentLoaded', () => {
    fetchCartItems();

    const checkoutForm = document.getElementById('checkout-form');
    checkoutForm.addEventListener('submit', handleCheckout);
});

function fetchCartItems() {
    fetch('/auth/cart', {
        method: 'GET',
        credentials: 'include',
    })
        .then((response) => {
            if (!response.ok) throw new Error('Failed to fetch cart items');
            return response.json();
        })
        .then((cartItems) => renderCartItems(cartItems))
        .catch((error) => console.error('Error fetching cart items:', error));
}

function renderCartItems(cartItems) {
    const itemsContainer = document.querySelector('.items-container');
    const totalItems = document.getElementById('total-items');
    const totalPrice = document.getElementById('total-price');

    let totalItemCount = 0;
    let totalCost = 0;

    itemsContainer.innerHTML = '';
    cartItems.forEach((item) => {
        const imagePath = item.image_url; // Use the image URL from the backend
        const itemTotal = item.price * item.quantity;
        totalItemCount += item.quantity;
        totalCost += itemTotal;

        itemsContainer.innerHTML += `
            <div class="item">
                <img src="${imagePath}" alt="${item.name}">
                <div>
                    <p>${item.name}</p>
                    <p>Quantity: ${item.quantity}</p>
                </div>
                <p>$${itemTotal.toFixed(2)}</p>
            </div>
        `;
    });

    totalItems.textContent = totalItemCount;
    totalPrice.textContent = `$${totalCost.toFixed(2)}`;
}

function handleCheckout(event) {
    event.preventDefault();

    // Collect form data
    const formData = new FormData(event.target);
    const shippingDetails = Object.fromEntries(formData);

    // Fetch cart items and proceed with checkout
    fetch('/auth/cart', {
        method: 'GET',
        credentials: 'include',
    })
        .then((response) => {
            if (!response.ok) throw new Error('Failed to fetch cart items');
            return response.json();
        })
        .then((cartItems) => {
            const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

            // Send checkout data to the backend
            return fetch('/auth/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    ...shippingDetails,
                    cartItems,
                    totalPrice,
                }),
            });
        })
        .then((response) => {
            if (!response.ok) throw new Error('Checkout failed');
            return response.json();
        })
        .then((data) => {
            alert('Order placed successfully! Redirecting to confirmation page...');
            window.location.href = `/html/confirmation.html?orderId=${data.orderId}`;
        })
        .catch((error) => {
            console.error('Checkout error:', error);
            alert('Failed to process checkout. Please try again.');
        });
}function handleCheckout(event) {
    event.preventDefault();

    // Collect form data
    const formData = new FormData(event.target);
    const shippingDetails = Object.fromEntries(formData);

    // Fetch cart items and proceed with checkout
    fetch('/auth/cart', {
        method: 'GET',
        credentials: 'include',
    })
        .then((response) => {
            if (!response.ok) throw new Error('Failed to fetch cart items');
            return response.json();
        })
        .then((cartItems) => {
            const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

            // Send checkout data to the backend
            return fetch('/auth/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    ...shippingDetails,
                    cartItems,
                    totalPrice,
                }),
            });
        })
        .then((response) => {
            if (!response.ok) throw new Error('Checkout failed');
            return response.json();
        })
        .then((data) => {
            alert('Order placed successfully! Redirecting to confirmation page...');
            window.location.href = `/html/confirmation.html?orderId=${data.orderId}`;
        })
        .catch((error) => {
            console.error('Checkout error:', error);
            alert('Failed to process checkout. Please try again.');
        });
}