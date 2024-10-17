const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
const path = require('path');
const multer = require('multer');
const authMiddleware = require('../middleware/authMiddleware');

// Konfiguracja multer do zapisywania plików w folderze uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads')); // Folder, gdzie będą zapisywane pliki
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9); // Unikalna nazwa pliku
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

// Dodanie walidacji typu pliku, aby akceptować tylko obrazy
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Nieprawidłowy typ pliku. Proszę przesłać obrazy.'), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

// Trasa dodawania oferty z obsługą przesyłania obrazów
router.post('/', upload.array('images'), authMiddleware, propertyController.addProperty);

// Pozostałe trasy
router.put('/:id', authMiddleware, propertyController.updateProperty);
router.delete('/:id', authMiddleware, propertyController.deleteProperty);
router.get('/',   propertyController.getAllProperties);
router.get('/:id',    propertyController.getPropertyById);

module.exports = router;
