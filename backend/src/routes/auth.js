const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const db = require('../config/db');

router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    console.log("Received registration request:", req.body);

    if (!username || !email || !password) {
        console.error("Missing fields in registration request");
        return res.status(400).json({ error: 'All fields (name, email, password) are required' });
    }

    // Proceed with password hashing
    console.log("Starting password hashing");
    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 10);
        console.log("Password hashed successfully:", hashedPassword);
    } catch (error) {
        console.error("Error hashing password:", error);
        return res.status(500).json({ error: 'Failed to hash password' });
    }

    // Check if email already exists
    const checkEmailSql = 'SELECT email FROM users WHERE email = ?';
    db.get(checkEmailSql, [email], (err, row) => {
        if (err) {
            console.error("Error checking email in database:", err.message);
            return res.status(500).json({ error: err.message });
        }
        if (row) {
            console.error("Email already in use");
            return res.status(409).json({ error: 'Email already in use' });
        }

        // Insert the new user into the database
        console.log("Inserting user into the database");
        const sql = 'INSERT INTO users (username, email, password) VALUES (?,?,?)';
        db.run(sql, [username, email, hashedPassword], function(err) {
            if (err) {
                console.error("Error inserting user into database:", err.message);
                return res.status(400).json({ error: err.message });
            }
            console.log("User created successfully");

            // Generate token after successful registration
            const token = jwt.sign({ id: this.lastID, name: username }, 'your_secret_key_here', { expiresIn: '1h' });  // It's better to keep your secret key in an environment variable

            res.json({ message: 'User created successfully', token });
        });
    });
});



router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }
    const sql = 'SELECT * FROM users WHERE email = ?';
    db.get(sql, [email], async (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: 'User not found' });
        }
        if (await bcrypt.compare(password, row.password)) {
            const token = jwt.sign({ id: row.id , name: row.username}, 'your_secret_key_here', { expiresIn: '1h' });  // It's better to keep your secret key in an environment variable
            return res.json({ message: 'User logged in successfully', token });
        }
        return res.status(401).json({ error: 'Invalid password' });
    });
});

module.exports = router