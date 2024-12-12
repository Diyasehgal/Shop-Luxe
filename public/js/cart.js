document.addEventListener('DOMContentLoaded', () => {
    fetchCartItems();

    // Event delegation for remove and quantity change
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-btn')) {
            const productId = e.target.dataset.productId;
            if (productId) {
                removeItemFromCart(productId);
            } else {
                console.error('Product ID not found for remove button.');
            }
        }
    });

    document.addEventListener('change', (e) => {
        if (e.target.classList.contains('quantity-input')) {
            const productId = e.target.dataset.productId;
            const newQuantity = parseInt(e.target.value);
            if (newQuantity > 0) {
                updateCartItemQuantity(productId, newQuantity);
            } else {
                alert('Quantity must be at least 1.');
                e.target.value = 1; // Reset to 1 if invalid
            }
        }
    });
});

function fetchCartItems() {
    fetch('/auth/cart', {
        method: 'GET',
        credentials: 'include',
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Failed to fetch cart items');
            }
            return response.json();
        })
        .then((cartItems) => renderCart(cartItems))
        .catch((err) => console.error('Error fetching cart items:', err));
}

function renderCart(cartItems) {
    const cartItemsContainer = document.querySelector('.cart-items');
    const totalItems = document.querySelector('#total-items');
    const totalPrice = document.querySelector('#total-price');

    cartItemsContainer.innerHTML = '';
    let total = 0;
    let totalItemsCount = 0;

    cartItems.forEach((item) => {
        const imagePath = `../images/${item.name.toLowerCase()}.webp`;
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        totalItemsCount += item.quantity;

        cartItemsContainer.innerHTML += `
            <div class="cart-item">
                <img src="../images/${item.name.toLowerCase()}.webp" alt="${item.name}">
                <div class="item-details">
                    <h2>${item.name}</h2>
                    <p>Price: $${item.price}</p>
                    <div class="quantity">
                        <label for="quantity-${item.id}">Quantity:</label>
                        <input type="number" id="quantity-${item.id}" value="${item.quantity}" min="1" data-product-id="${item.id}" class="quantity-input">
                    </div>
                    <p class="item-total">Total: $${itemTotal}</p>
                </div>
                <button class="btn remove-btn" data-product-id="${item.id}">Remove</button>
            </div>
        `;
    });

    totalItems.textContent = totalItemsCount;
    totalPrice.textContent = `$${total}`;
}

function removeItemFromCart(productId) {
    fetch('/auth/cart/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
        credentials: 'include',
    })
        .then((response) => {
            if (response.ok) {
                fetchCartItems();
            } else {
                console.error('Failed to remove item from cart');
            }
        })
        .catch((err) => console.error('Error removing item from cart:', err));
}

function updateCartItemQuantity(productId, newQuantity) {
    fetch('/auth/cart/update-quantity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: newQuantity }),
        credentials: 'include',
    })
        .then((response) => {
            if (response.ok) {
                fetchCartItems(); // Re-render the cart after updating the quantity
            } else {
                console.error('Failed to update cart item quantity');
            }
        })
        .catch((err) => console.error('Error updating cart item quantity:', err));
}