document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get('orderId');

    if (orderId) {
        document.getElementById('order-id').textContent = orderId;
    } else {
        alert('Order ID not found.');
    }
});