// src/db.js
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

// Variable para guardar la conexión a la base de datos
let dbConnection;

const db = {
  //Inicializamos la BD y creamos la tabla
  init: async () => {
    dbConnection = await open({
      // filename: ':memory:',  <-- Comentamos la memoria RAM
      filename: "./test.sqlite", // <-- Creamos un archivo físico
      driver: sqlite3.Database,
    });

    await dbConnection.exec(`
      CREATE TABLE IF NOT EXISTS payasos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        arma TEXT
      )
    `);
  },

  //Buscar payaso por email
  findPayasoByEmail: async (email) => {
    // get() devuelve la primera fila que coincida
    const payaso = await dbConnection.get(
      "SELECT * FROM payasos WHERE email = ?",
      [email],
    );
    return payaso || null;
  },

  //Buscar payaso por nombre
  findPayasoByName: async (name) => {
    const payaso = await dbConnection.get(
      "SELECT * FROM payasos WHERE name = ?",
      [name],
    );
    return payaso || null;
  },

  // Obtener todos los payasos
  findAllPayasos: async () => {
    // all() devuelve un array con todas las filas que coincidan con la consulta
    const payasos = await dbConnection.all("SELECT * FROM payasos");
    return payasos;
  },

  //Guardar payaso
  savePayaso: async (payaso) => {
    // run() ejecuta la consulta (INSERT, UPDATE, DELETE)
    const result = await dbConnection.run(
      "INSERT INTO payasos (name, email, arma) VALUES (?, ?, ?)",
      [payaso.name, payaso.email, payaso.arma],
    );
    // SQLite devuelve el ID autogenerado en result.lastID
    return {
      id: result.lastID,
      name: payaso.name,
      email: payaso.email,
      arma: payaso.arma,
    };
  },

  //Limpiar la base de datos entre pruebas (Borramos los registros, no la tabla)
  clear: async () => {
    await dbConnection.run("DELETE FROM payasos");
  },

  //Cerrar la conexión al terminar todo
  close: async () => {
    if (dbConnection) {
      await dbConnection.close();
    }
  },
};

module.exports = db;
