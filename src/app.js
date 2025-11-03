const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/ecommerce")
    .then(() => console.log("Conectado a MongoDB"))
    .catch(err => console.error("Error al conectar con MongoDB:", err));




const express = require("express");
const { Server } = require("socket.io");
const handlebars = require("express-handlebars");
const path = require("path");

const productsRouter = require("./routes/products");
const cartsRouter = require("./routes/carts");
const ProductManager = require("./managers/ProductManager");

const app = express();
const PORT = 8080;

const httpServer = app.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto ${PORT}`);
});

const io = new Server(httpServer);
const productManager = new ProductManager();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Configuración de Handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");

// Rutas API
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

// Rutas de vistas
app.get("/", async (req, res) => {
    const products = await productManager.getProducts();
    res.render("home", { products });
});

app.get("/realtimeproducts", async (req, res) => {
    const products = await productManager.getProducts();
    res.render("realTimeProducts", { products });
});

// WebSocket
io.on("connection", (socket) => {
    console.log("Cliente conectado");

    socket.on("newProduct", async (data) => {
        await productManager.addProduct(data);
        const updatedProducts = await productManager.getProducts();
        io.emit("productsUpdated", updatedProducts);
    });

    socket.on("deleteProduct", async (id) => {
        await productManager.deleteProduct(id);
        const updatedProducts = await productManager.getProducts();
        io.emit("productsUpdated", updatedProducts);
    });
});



// 1️) instalar dependencias:
//    npm install
//
// 2) levantar el servidor:
//    npm start
//
// 3) rutas principales:
//    http://localhost:8080/home
//    http://localhost:8080/realtimeproducts
//
//
// el servidor se inicia desde src/app.js
// 

