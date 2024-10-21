const express = require("express");
const mongoose = require("mongoose");

const cors = require("cors"); // Importowanie cors
const path = require("path");
const authRoutes = require("./routes/auth");
const propertyRoutes = require("./routes/PropertyRoutes");
require("dotenv").config();

const app = express();
const bcrypt = require("bcryptjs");
require("dotenv").config();

const testPassword = async () => {
  const plainPassword = "admin123"; // Twoje hasło
  const hashedPassword = process.env.PASSWORD; // Hash z .env

  const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
  console.log("Czy hasło jest poprawne:", isMatch);
};

const plainPassword = "admin123"; // Twoje hasło do zahashowania
bcrypt.hash(plainPassword, 10, (err, hash) => {
  if (err) throw err;
  console.log("Hashed password:", hash);
});

testPassword();

// Konfiguracja CORS
const allowedOrigins = [
  "https://www.backend-production-0309.up.railway.app",  
  "https://www.investingeorgia.com.pl",  
  "http://localhost:3000",  
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Pozwól na żądania bez origin (np. z curl, Postman)
      if (!origin) return callback(null, true);

      // Sprawdź, czy domena jest w dozwolonych pochodzeniach
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Jeśli używasz ciasteczek lub sesji
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

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/auth", authRoutes);

// Endpointy ofert nieruchomości
app.use("/properties", propertyRoutes);


const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
