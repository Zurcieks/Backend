const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function (req, res, next) {
    // Pobierz token z nagłówka
    const authHeader = req.header('Authorization');

    // Sprawdź, czy nagłówek istnieje i zaczyna się od "Bearer "
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ msg: 'Brak tokenu, autoryzacja zabroniona' });
    }

    // Usuń "Bearer " z tokena
    const token = authHeader.split(' ')[1];
    console.log(token);

    try {
        // Weryfikacja tokena
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token jest nieprawidłowy' });
    }
};
