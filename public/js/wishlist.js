document.addEventListener('DOMContentLoaded', () => {
    const wishlistGrid = document.querySelector('.wishlist-grid');

    // Fetch wishlist items
    fetch('/auth/wishlist', { method: 'GET', credentials: 'include' })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                return response.json().then((data) => {
                    throw new Error(data.error || 'Failed to fetch wishlist items.');
                });
            }
        })
        .then((data) => {
            if (data.length === 0) {
                wishlistGrid.innerHTML = '<p>Your wishlist is empty.</p>';
                return;
            }

            wishlistGrid.innerHTML = data
                .map(
                    (item) => `
                <div class="wishlist-item">
                    <img src="${item.image_url}" alt="${item.name}">
                    <h3>${item.name}</h3>
                    <p>Price: $${item.price}</p>
                    <div class="actions">
                        <button class="btn move-to-cart" data-id="${item.id}">Move to Cart</button>
                        <button class="btn remove" data-id="${item.id}">Remove</button>
                    </div>
                </div>
            `
                )
                .join('');
        })
        .catch((error) => {
            wishlistGrid.innerHTML = `<p>Error: ${error.message}</p>`;
        });

    // Event delegation for wishlist actions
    wishlistGrid.addEventListener('click', (event) => {
        const productId = event.target.dataset.id;

        if (event.target.classList.contains('remove')) {
            // Remove product from wishlist
            fetch('/auth/wishlist/remove', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ productId }),
            })
                .then((response) => {
                    if (response.ok) {
                        alert('Product removed from wishlist successfully.');
                        event.target.closest('.wishlist-item').remove();

                        // Show empty message if no items are left
                        if (!wishlistGrid.querySelector('.wishlist-item')) {
                            wishlistGrid.innerHTML = '<p>Your wishlist is empty.</p>';
                        }
                    } else {
                        return response.json().then((data) => {
                            throw new Error(data.error || 'Failed to remove product.');
                        });
                    }
                })
                .catch((error) => {
                    alert(`Error: ${error.message}`);
                });
        } else if (event.target.classList.contains('move-to-cart')) {
            // Move product to cart
            fetch('/auth/cart/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ productId }),
            })
                .then((response) => {
                    if (response.ok) {
                        alert('Product moved to cart successfully.');
                        event.target.closest('.wishlist-item').remove();

                        // Show empty message if no items are left
                        if (!wishlistGrid.querySelector('.wishlist-item')) {
                            wishlistGrid.innerHTML = '<p>Your wishlist is empty.</p>';
                        }
                    } else {
                        return response.json().then((data) => {
                            throw new Error(data.error || 'Failed to move product to cart.');
                        });
                    }
                })
                .catch((error) => {
                    alert(`Error: ${error.message}`);
                });
        }
    });
});