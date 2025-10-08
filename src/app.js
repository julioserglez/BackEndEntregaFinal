const express = require("express");
const app = express();
const path = require("path");
const handlebars = require("express-handlebars");
const mongoose = require("mongoose");
const config = require("./config");
const inicioRouter = require('./routes/inicioRouter');
const productsRouter = require('./routes/productsRouter');
const cartRouter = require('./routes/cartRouter');

//handlebars
app.engine(
  "hbs",
  handlebars.engine({
    extname: ".hbs",
    defaultLayout: "main",
    partialsDir: path.join(__dirname, "views", "partials"),
    runtimeOptions: {
            allowProtoPropertiesByDefault: true,
            allowProtoMethodsByDefault: true
        }
  })
);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

mongoose
  .connect(config.database.uri)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => console.error(err));

// MIDDELWARES
app.use(express.json()); // <- {}
app.use(express.urlencoded({ extended: false })); // FORM <- {}
// Configurar la carpeta 'public' para servir archivos estáticos
app.use(express.static(path.join(__dirname, "public")));
// Configurar la carpeta 'files' para servir archivos estáticos
app.use("/files", express.static(path.join(__dirname, "files")));
// RUTAS
app.use("/", inicioRouter);
app.use("/products", productsRouter);
app.use("/cart", cartRouter);

module.exports = app;