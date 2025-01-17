const express = require("express");
const path = require("path");

const app = express();

// Sirve archivos estáticos desde la carpeta "front"
app.use(express.static(path.join(__dirname, "front")));

// Ruta principal
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "front", "index.html"));
});

// Puerto dinámico para Vercel
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
