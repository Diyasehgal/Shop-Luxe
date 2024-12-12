const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../dbConfig');

const router = express.Router();
const SECRET_KEY = 'your-secret-key';

// Register a new user
router.post('/register', (req, res) => {
    const { email, password } = req.body;

    db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
        if (user) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);
        const sql = 'INSERT INTO users (email, password) VALUES (?, ?)';
        db.run(sql, [email, hashedPassword], (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error registering user' });
            }
            // Redirect to login page after successful registration
            res.redirect('/html/login.html');
        });
    });
});

// Login a user
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });

        // Set the token as a cookie
        res.cookie('token', token, {
            httpOnly: false, // Allow access via JavaScript
            maxAge: 3600000, // 1 hour expiration
            path: '/', // Make available on all routes
            sameSite: 'Strict', // Adjust as needed (e.g., 'Lax' for cross-origin scenarios)
        });
        // Redirect to the home page after login
        res.redirect('/');
    });
});

// Logout a user
router.get('/logout', (req, res) => {
    res.clearCookie('token'); // Clear the token cookie
    res.redirect('/'); // Redirect to the home page
});

// Profile route
router.get('/profile', (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1]; // Extract the token

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }

        // Query the database for the user's email
        const userId = decoded.id;
        db.get('SELECT email FROM users WHERE id = ?', [userId], (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            if (!row) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Return the user's email
            res.json({ email: row.email });
        });
    });
});

// Add product to cart
router.post('/cart/add', (req, res) => {
    const { productId } = req.body;
    const token = req.cookies.token;

    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(403).json({ error: 'Invalid or expired token' });

        const userId = decoded.id;
        const sql = 'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, 1)';

        db.run(sql, [userId, productId], (err) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.status(200).json({ message: 'Product added to cart successfully' });
        });
    });
});

// Get cart items for a user
router.get('/cart', (req, res) => {
    const token = req.cookies.token;

    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(403).json({ error: 'Invalid or expired token' });

        const userId = decoded.id;
        const sql = `
            SELECT products.id, products.name, products.price, cart.quantity
            FROM cart
            JOIN products ON cart.product_id = products.id
            WHERE cart.user_id = ?
        `;

        db.all(sql, [userId], (err, rows) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.status(200).json(rows);
        });
    });
});

// Remove item from cart
router.post('/cart/remove', (req, res) => {
    const { productId } = req.body;
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }

        const userId = decoded.id;
        const sql = 'DELETE FROM cart WHERE user_id = ? AND product_id = ?';

        db.run(sql, [userId, productId], (err) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            res.status(200).json({ message: 'Product removed from cart successfully' });
        });
    });
});

// Update cart item quantity
router.post('/cart/update-quantity', (req, res) => {
    const { productId, quantity } = req.body;
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }

        const userId = decoded.id;
        const sql = 'UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?';

        db.run(sql, [quantity, userId, productId], (err) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            res.status(200).json({ message: 'Quantity updated successfully' });
        });
    });
});

module.exports = router;