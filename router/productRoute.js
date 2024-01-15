const product = require("../model/product");
const {createProduct,
     getProducts,
     getProduct,
     updateProduct,
     deleteProduct} = require("../controller/productController");
const {authMiddleware, isAdmin} = require("../middleware/authMiddleware");

const productRouter = require("express").Router();

productRouter.post("/create", authMiddleware, isAdmin, createProduct);
productRouter.get("/products", authMiddleware, getProducts);
productRouter.get("/product/:id", authMiddleware, getProduct);
productRouter.put("/product/:id", authMiddleware, isAdmin, updateProduct);
productRouter.delete("/product/:id", authMiddleware, isAdmin, deleteProduct);

module.exports = {router: productRouter};