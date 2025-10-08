// config/index.js
const dotenv = require('dotenv');
const path = require('path');

// Cargar variables de entorno según el ambiente
const envFile = process.env.NODE_ENV === 'production' 
  ? '.env.production' 
  : '.env';
dotenv.config({ path: path.join(__dirname, '..', envFile) });

const config = {
  // Servidor
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT) || 3000,
  HOST: process.env.HOST || 'localhost',

  // Base de datos
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 27017,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    authSource: process.env.DB_AUTH_SOURCE || 'admin',
    uri: process.env.MONGO_URI,
    maxPoolSize: parseInt(process.env.DB_MAX_POOL_SIZE) || 10,
    timeout: parseInt(process.env.DB_TIMEOUT) || 5000,
    socketTimeout: parseInt(process.env.DB_SOCKET_TIMEOUT) || 45000,
  },

  // Utilidades
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
};

module.exports = config;