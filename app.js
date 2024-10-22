const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const authRoutes = require("./routes/auth");
const propertyRoutes = require("./routes/PropertyRoutes");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
require("dotenv").config();

const app = express();

// Konfiguracja Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Konfiguracja multer-storage-cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "real_estate_offers", // Nazwa folderu, do którego będą trafiać pliki w Cloudinary
    allowed_formats: ["jpg", "png"], // Akceptowane formaty
  },
});

// Konfiguracja multer do obsługi przesyłania plików
const upload = multer({ storage });

// Konfiguracja CORS
const allowedOrigins = [
  "https://www.backend-production-0309.up.railway.app",
  "https://www.investingeorgia.com.pl",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Middleware do parsowania JSON
app.use(express.json());

// Połączenie z MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Trasy
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/auth", authRoutes);
app.use("/properties", propertyRoutes);

// Endpoint dodawania oferty nieruchomości z obrazami
app.post("/properties", upload.array("images"), (req, res) => {
  const images = req.files.map(file => file.path); // Linki do obrazów w Cloudinary
  // Logika dodawania nieruchomości do bazy danych
  res.status(200).json({ message: "Property added", images });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
