const express = require("express");
const mongoose = require("mongoose");
const app = express();

const userRoutes = require('./routes/user');

// Connection to database
mongoose
  .connect(
    "mongodb+srv://ambre:monmotdepasse@cluster0.nksbe.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    { useNewUrlParser: true,
      useUnifiedTopology: true
    }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use(express.json());

// Set response headers to avoid CORS errors
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// Middleware declaration
app.use('/api/auth', userRoutes);

// Make app available
module.exports = app;
