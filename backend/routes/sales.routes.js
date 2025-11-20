import * as salesController from "../controllers/sales.controller.js";
import express from 'express'
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const salesRouter = express.Router()

salesRouter.post('/new-sale', isAuthenticated, salesController.createDailySales)
salesRouter.get('/all-sales', isAuthenticated, salesController.getAllDailySales)
salesRouter.get('/get-shop-sales/:shopId', isAuthenticated, salesController.getSalesByShopId)
salesRouter.put('update-daily-sale/:shopId', isAuthenticated, salesController.updateDailySales)

export default salesRouter;