const express = require("express");
const ProductModel = require("../dao/models/product.model");
const router = express.Router();

// GET con paginación, filtros y orden
router.get("/", async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;

        let filter = {};
        if (query) {
            filter = {
                $or: [
                    { category: query },
                    { status: query === "true" },
                ],
            };
        }

        let sortOption = {};
        if (sort === "asc") sortOption = { price: 1 };
        if (sort === "desc") sortOption = { price: -1 };

        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: sortOption,
            lean: true,
        };

        const result = await ProductModel.paginate(filter, options);

        res.json({
            status: "success",
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage
                ? `/api/products?page=${result.prevPage}`
                : null,
            nextLink: result.hasNextPage
                ? `/api/products?page=${result.nextPage}`
                : null,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Error al obtener productos" });
    }
});

module.exports = router;
