const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("../repository/payasosRepository");
const payasosService = require("../service/payasosService");

// 1. PRIMERO CREAMOS LA APP
const app = express();
const PORT = 3000;

// 2. LUEGO CONFIGURAMOS LOS MIDDLEWARES
app.use(cors());
app.use(express.json());

// 3. CONFIGURAMOS LAS RUTAS DE ARCHIVOS (El orden importa aquí)
// Esto busca el index.html subiendo un nivel desde la carpeta controller
app.use(express.static(path.join(__dirname, "..")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "index.html"));
});

// -----------------------------------------------
// --- API CONTROLLER ---
// -----------------------------------------------

app.get("/payasos", async (req, res) => {
  try {
    const payasos = await payasosService.getAllPayasos();
    res.status(200).json(payasos);
  } catch (error) {
    res.status(500).json({ error: "Error interno", details: error.message });
  }
});

app.post("/payasos", async (req, res) => {
  try {
    const { name, email, arma } = req.body;
    const newPayaso = await payasosService.registerPayaso(name, email, arma);
    res.status(201).json(newPayaso);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// -----------------------------------------------
// --- INICIO DEL SERVIDOR ---
// -----------------------------------------------

async function startServer() {
  try {
    await db.init();
    app.listen(PORT, () => {
      console.log(`🤡 Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(" Error al iniciar la aplicación:", error);
  }
}

startServer();
