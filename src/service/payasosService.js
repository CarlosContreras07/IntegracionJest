// src/payasosService.js
const db = require("../repository/payasosRepository");

async function registerPayaso(name, email, arma) {
  if (!name || !email) {
    throw new Error("El nombre y el email son obligatorios");
  }

  // 1. Verificamos en la base de datos si el email ya existe
  const existingPayaso = await db.findPayasoByEmail(email);
  const existingPayasoByName = await db.findPayasoByName(name);

  if (existingPayaso) {
    throw new Error("El payaso ya está registrado con ese email");
  } else if (existingPayasoByName) {
    throw new Error("El payaso ya está registrado con ese nombre");
  }

  // 2. Si no existe, lo guardamos en la base de datos
  const newPayaso = await db.savePayaso({ name, email, arma });

  return newPayaso;
} //fin funcion registerPayaso

//FUNCION PARA OBTENER TODOS LOS PAYASOS DE LA BASE DE DATOS
async function getAllPayasos() {
  // Pedimos todos los payasos a la base de datos
  const payasos = await db.findAllPayasos();
  return payasos;
} //fin funcion getAllPayasos

module.exports = { registerPayaso, getAllPayasos };
