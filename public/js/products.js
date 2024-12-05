// JavaScript for Category Toggle
document.addEventListener("DOMContentLoaded", () => {
    const buttons = document.querySelectorAll('.category-btn');
    const categories = document.querySelectorAll('.product-category');

    // Retrieve the category from the URL query string
    const params = new URLSearchParams(window.location.search);
    const currentCategory = params.get('category') || 'electronics'; // Default to 'electronics'

    // Set the active category button and show the correct category on page load
    buttons.forEach((button) => {
        if (button.dataset.category === currentCategory) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });

    categories.forEach((category) => {
        if (category.classList.contains(currentCategory)) {
            category.classList.add('active');
        } else {
            category.classList.remove('active');
        }
    });

    // Add click event listener to category buttons
    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            buttons.forEach((btn) => btn.classList.remove('active'));

            // Add active class to the clicked button
            button.classList.add('active');

            // Hide all categories
            categories.forEach((category) =>
                category.classList.remove('active')
            );

            // Show the selected category
            const selectedCategory = button.dataset.category;
            document
                .querySelector(`.${selectedCategory}`)
                .classList.add('active');

            // Update the URL query parameter
            window.history.pushState({}, '', `?category=${selectedCategory}`);
        });
    });
});