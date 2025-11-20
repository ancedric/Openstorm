import * as renewalController from "../controllers/renewal.controller.js";
import express from 'express'
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import upload from "../config/multer.config.js";

const renewalRouter = express.Router()

renewalRouter.post('/new-renewal', upload.single('capture'), isAuthenticated, renewalController.addRenewal)
renewalRouter.get('/all-renewals', isAuthenticated, renewalController.allRenewals)

export default renewalRouter;