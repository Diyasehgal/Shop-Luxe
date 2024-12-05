// Back Button Logic
document.addEventListener("DOMContentLoaded", () => {
    // Retrieve query parameters from the URL
    const params = new URLSearchParams(window.location.search);
    const category = params.get("category") || "all";
    const origin = params.get("origin");

    // Dynamically set the href for the back button
    const backButton = document.getElementById("back-to-products");
    if (backButton) {
        if (origin === "cart") {
            backButton.href = "../cart.html"; // Redirect back to cart
        } else if (origin === "home") {
            backButton.href = "../../../index.html"; // Redirect back to home
        } else {
            backButton.href = `../products.html?category=${category}`; // Default to products page
        }
    }
});