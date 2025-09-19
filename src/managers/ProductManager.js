const fs = require("fs");
const path = require("path");

class ProductManager {
    constructor() {
        this.filePath = path.join(__dirname, "../data/products.json");
    }

    async getProducts() {
        try {
            const data = await fs.promises.readFile(this.filePath, "utf-8");
            return JSON.parse(data);
        } catch (error) {
            return [];
        }
    }

    async getProductById(id) {
        const products = await this.getProducts();
        return products.find((p) => p.id === id);
    }

    async addProduct(product) {
        const products = await this.getProducts();

        //genera el id automatico
        const newId = products.length === 0 ? 1 : products[products.length - 1].id + 1;
        const newProduct = { id: newId, ...product };

        products.push(newProduct);

        await fs.promises.writeFile(this.filePath, JSON.stringify(products, null, 2));
        return newProduct;
    }

    async updateProduct(id, updateFields) {
        const products = await this.getProducts();
        const index = products.findIndex((p) => p.id === id);
        if (index === -1) return null;

        products[index] = { ...products[index], ...updateFields, id };
        await fs.promises.writeFile(this.filePath, JSON.stringify(products, null, 2));
        return products[index];
    }

    async deleteProduct(id) {
        const products = await this.getProducts();
        const index = products.findIndex((p) => p.id === id);
        if (index === -1) return false;

        products.splice(index, 1);
        await fs.promises.writeFile(this.filePath, JSON.stringify(products, null, 2));
        return true;
    }
}

module.exports = ProductManager;
