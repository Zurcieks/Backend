const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Kontroler logowania
exports.loginUser = async (req, res) => {
    const { username, password } = req.body;

    const envUsername = 'admin12345';
    const envPassword = process.env.PASSWORD; // Zahashowane hasło w .env

    console.log('Env Username:', envUsername); // Logowanie username
    console.log('Env Password (hashed):', envPassword); // Logowanie zahashowanego hasła

    try {
        if (username !== envUsername) {
            return res.status(400).json({ msg: 'Nieprawidłowy username lub hasło' });
        }

        const isMatch = await bcrypt.compare(password, envPassword);
        console.log('Czy hasło pasuje:', isMatch); // Sprawdzamy, czy porównanie hasła zwraca true

        if (!isMatch) {
            return res.status(400).json({ msg: 'Nieprawidłowy username lub hasło' });
        }

        // Token JWT
        const payload = {
            user: {
                username: envUsername
            }
        };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '10y' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
