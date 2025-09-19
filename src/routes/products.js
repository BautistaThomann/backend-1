const express = require("express");
const ProductManager = require("../managers/ProductManager");
const router = express.Router();

const productManager = new ProductManager();

// GET todos los productos
router.get("/", async (req, res) => {
    const products = await productManager.getProducts();
    res.json(products);
});

// GET producto por id
router.get("/:pid", async (req, res) => {
    const pid = parseInt(req.params.pid);
    const product = await productManager.getProductById(pid);
    if (!product) return res.status(404).json({ error: "producto no encontrado" });
    res.json(product);
});

// POST crear producto
router.post("/", async (req, res) => {
    const newProduct = await productManager.addProduct(req.body);
    res.status(201).json(newProduct);
});

// PUT actualizar producto
router.put("/:pid", async (req, res) => {
    const pid = parseInt(req.params.pid);
    const updatedProduct = await productManager.updateProduct(pid, req.body);
    if (!updatedProduct) return res.status(404).json({ error: "producto no encontrado" });
    res.json(updatedProduct);
});

// DELETE eliminar producto
router.delete("/:pid", async (req, res) => {
    const pid = parseInt(req.params.pid);
    const deleted = await productManager.deleteProduct(pid);
    if (!deleted) return res.status(404).json({ error: "producto no encontrado" });
    res.json({ message: "producto eliminado correctamente" });
});

module.exports = router;
