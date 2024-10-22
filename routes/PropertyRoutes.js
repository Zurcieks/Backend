const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const authMiddleware = require('../middleware/authMiddleware');

// Konfiguracja Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Konfiguracja multer do zapisywania plików w Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'real_estate_offers', // Folder w Cloudinary
    allowed_formats: ['jpg', 'png'], // Dozwolone formaty plików
  },
});

const upload = multer({ storage });

// Trasa dodawania oferty z obsługą przesyłania obrazów
router.post('/', upload.array('images'), authMiddleware, propertyController.addProperty);

// Pozostałe trasy
router.patch('/:id', authMiddleware, propertyController.updateProperty);
router.delete('/:id', authMiddleware, propertyController.deleteProperty);
router.get('/', propertyController.getAllProperties);
router.get('/:id', propertyController.getPropertyById);

module.exports = router;
