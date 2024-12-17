const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const db = require('/backend/dbConfig');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // For parsing form submissions
app.use(cookieParser()); // For parsing cookies
app.use(express.static(path.join(__dirname, '/public')));

// Routes
const authRoutes = require('/backend/routes/auth');
app.use('/auth', authRoutes);

// Redirect root URL to index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/html/index.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});