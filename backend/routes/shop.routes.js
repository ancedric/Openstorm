import * as shop from '../controllers/shop.controller.js'
import express from 'express'
import upload from '../config/multer.config.js'
import { isAuthenticated } from '../middlewares/auth.middleware.js'

const shopRouter = express.Router()

shopRouter.post('/new-shop', upload.single('image'), isAuthenticated, shop.createNewShop)
shopRouter.get('/all-shops', isAuthenticated, shop.allShops)
shopRouter.get('/get-user-shop/:userRef', isAuthenticated, shop.getShopByUserRef)
shopRouter.get('/shop/:id', shop.getShopFromId)
shopRouter.delete('/delete-shop/:id', isAuthenticated, shop.deleteShop)
shopRouter.put('/update-shop/:id/:name/:activity/:conuntry/:city/:image', isAuthenticated, shop.updateShop)
shopRouter.put('/update-name/:id/:newName', isAuthenticated, shop.updateShopName)
shopRouter.put('/update-activity/:id/:newActivity', isAuthenticated, shop.updateShopActivity)
shopRouter.put('/update-image/:id/:newImage',upload.single('image'), shop.updateShopImage)
shopRouter.put('/update-opening-hour/:id/:newOpeningHour', isAuthenticated, shop.updateShopOpeningHour)
shopRouter.put('/update-close-hour/:id/:newCloseHour', isAuthenticated, shop.updateShopCloseHour)
shopRouter.put('/update-cash/:id', isAuthenticated, shop.updateShopCash)
shopRouter.put('/update-remaining-activation-time/:id', isAuthenticated, shop.updateShopRemainingActivationTime)
shopRouter.put('/update-subscription-state/:shopRef', isAuthenticated, shop.updateSubscriptionState)

export default shopRouter;