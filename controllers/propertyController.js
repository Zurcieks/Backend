const Property = require('../models/Property');
const cloudinary = require('cloudinary').v2;

// Konfiguracja Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Dodanie nowej oferty
exports.addProperty = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('Request files:', req.files);

    const { 
      title, 
      description, 
      bedrooms, 
      bathrooms, 
      rooms, 
      area, 
      yearBuild, 
      floors, 
      price 
    } = req.body;

    // Sprawdzenie, czy są przesłane pliki
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Brak przesłanych zdjęć.' });
    }

    // Przesyłanie obrazów do Cloudinary
    const images = [];
    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'real_estate_offers', // Folder w Cloudinary
      });
      images.push(result.secure_url); // Zapisujemy bezpieczne URL-e obrazów
    }

    // Tworzenie nowego dokumentu Property
    const property = new Property({
      title,
      description,
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      rooms: Number(rooms),
      area: Number(area),
      yearBuild: Number(yearBuild),
      floors: Number(floors),
      price: Number(price),
      images, // Przesłane obrazy
    });

    // Zapisanie dokumentu do bazy danych
    await property.save();
    res.status(201).json(property);
  } catch (error) {
    console.error('Błąd dodawania oferty:', error);
    res.status(500).json({ message: error.message });
  }
};

// Pobranie wszystkich ofert
exports.getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find();
    res.status(200).json(properties);
  } catch (error) {
    console.error('Błąd pobierania ofert:', error);
    res.status(500).json({ message: error.message });
  }
};

// Pobranie pojedynczej oferty
exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Nie znaleziono oferty.' });
    }
    res.status(200).json(property);
  } catch (error) {
    console.error('Błąd pobierania oferty:', error);
    res.status(500).json({ message: error.message });
  }
};

// Aktualizacja oferty
exports.updateProperty = async (req, res) => {
  try {
    const updatedData = {
      ...req.body,
      bedrooms: req.body.bedrooms ? Number(req.body.bedrooms) : undefined,
      bathrooms: req.body.bathrooms ? Number(req.body.bathrooms) : undefined,
      rooms: req.body.rooms ? Number(req.body.rooms) : undefined,
      area: req.body.area ? Number(req.body.area) : undefined,
      yearBuild: req.body.yearBuild ? Number(req.body.yearBuild) : undefined,
      floors: req.body.floors ? Number(req.body.floors) : undefined,
      price: req.body.price ? Number(req.body.price) : undefined,
    };

    const property = await Property.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    if (!property) {
      return res.status(404).json({ message: 'Nie znaleziono oferty.' });
    }
    res.status(200).json(property);
  } catch (error) {
    console.error('Błąd aktualizacji oferty:', error);
    res.status(400).json({ message: error.message });
  }
};

// Usunięcie oferty
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Nie znaleziono oferty.' });
    }
    res.status(200).json({ message: 'Oferta została pomyślnie usunięta.' });
  } catch (error) {
    console.error('Błąd usuwania oferty:', error);
    res.status(500).json({ message: error.message });
  }
};
