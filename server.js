const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');

// --- Initialize App & Connect DB ---
const app = express();
connectDB();

// --- Core Middleware ---
app.use(cors());
app.use(express.json());

// --- API Routes ---
// Group all API routes under a single prefix like '/api'
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);

// --- Static File Serving ---
// This will serve all your HTML, CSS, and JS files from the 'public' folder.
app.use(express.static(path.join(__dirname, 'public')));

// --- Frontend Route Handling ---
// This is the crucial part. We will explicitly define the redirects,
// and then use a catch-all to serve the corresponding HTML file.
// This avoids the ambiguous `app.get('*', ...)` which seems to be the source of the issue.

// Handle specific form posts or redirects
app.post('/registration', (req, res) => {
    res.redirect('/registration.html');
});

app.get('/registration-success', (req, res) => {
    res.redirect('/home-page.html');
});

app.get('/admin-dashboard.html', (req, res) => {
    res.redirect('/admin.html');
});

// For any other path that is not an API route or a static file,
// attempt to send the corresponding HTML file from the 'public' folder.
// If it doesn't exist, fall back to index.html.
app.get('/:page', (req, res, next) => {
    const page = req.params.page;
    const filePath = path.join(__dirname, 'public', `${page}.html`);
    
    // Check if the file exists
    res.sendFile(filePath, (err) => {
        // If there's an error (like the file not existing),
        // we can either send a 404 or redirect to the home page.
        // Let's redirect to home for a better user experience.
        if (err) {
            res.redirect('/');
        }
    });
});

// A final fallback for the root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// --- Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));