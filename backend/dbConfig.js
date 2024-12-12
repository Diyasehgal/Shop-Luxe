const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connect to the database
const db = new sqlite3.Database(path.join(__dirname, 'db', 'database.sqlite'), (err) => {
    if (err) {
        console.error('Error connecting to SQLite database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
    }
});

// Initialize tables
const schema = `
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    image TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS cart (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (product_id) REFERENCES products (id)
);

CREATE TABLE IF NOT EXISTS wishlist (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip TEXT NOT NULL,
    total_price REAL NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    price REAL NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders (id),
    FOREIGN KEY (product_id) REFERENCES products (id)
);

`;

// Execute schema initialization
db.exec(schema, (err) => {
    if (err) {
        console.error('Error initializing database schema:', err.message);
    } else {
        console.log('Database schema initialized.');
    }
});

// // Insert sample products (run once; comment this section after first execution)
// //  const sampleProducts = `
// //  INSERT OR IGNORE INTO products (name, price, image) VALUES
// //  ('Laptop', 1000.0, 'laptop.webp'),
// //  ('Headphones', 300.0, 'Headphones.webp'),
// // ('Ipad', 400.0, 'Ipad.webp'),
// //  ('Smartphone', 800.0, 'Phone.webp'),
// //  ('Smartwatch', 150.0, 'smartwatch.webp'),
// //  ('Hoodie', 50.0, 'Hoodie.webp'),
// //  ('Sneakers', 120.0, 'Sneakers.webp'),
// //  ('Jacket', 200.0, 'Jacket.webp'),
// // ('Sunglasses', 100.0, 'Sunglasses.webp'),
// // ('Backpack', 75.0, 'Bagpack.webp'),
// // ('Camera', 500.0, 'Camera.webp'),
// //  ('Water Bottle', 25.0, 'water-bottle.webp');
// // `;

// db.exec(sampleProducts, (err) => {
//     if (err) {
//         console.error('Error inserting sample products:', err.message);
//     } else {
//         console.log('Sample products added to the database.');
//     }
// });

module.exports = db;