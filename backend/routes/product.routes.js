import * as productController from "../controllers/product.controller.js";
import express from 'express'
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import upload from "../config/multer.config.js";

const productRouter = express.Router()

productRouter.post('/new-product',upload.single('image'), isAuthenticated, productController.createNewProduct)
productRouter.get('/all-products', isAuthenticated, productController.allProducts)
productRouter.get('/get-shop-products/:shopRef', isAuthenticated, productController.getProductsByShopRef)
productRouter.get('/product/:id', isAuthenticated, productController.getProductFromId)
productRouter.delete('/delete-product/:id', isAuthenticated, productController.deleteProduct)
productRouter.put('/update-product/:id',upload.single('image'), isAuthenticated, productController.updateProduct)
productRouter.put('/update-price/:id', isAuthenticated, productController.updateProductPrice)
productRouter.put('/update-stock/:id', isAuthenticated, productController.updateProductStock)
productRouter.put('/upgrade-stock/:id', isAuthenticated, productController.addProductStock)

export default productRouter;