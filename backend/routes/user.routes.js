import * as userController from "../controllers/user.controller.js";
import express from 'express'
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const userRouter = express.Router()

userRouter.post('/register', userController.signup)
userRouter.post('/login', userController.login)
userRouter.get('/all-users', isAuthenticated, userController.allUsers)
userRouter.get('/user/:id', isAuthenticated, userController.getUserFromId)
userRouter.delete('/delete-user/:id', isAuthenticated, userController.deleteUser)
userRouter.put('/update-user/:id', isAuthenticated, userController.updateUser)
userRouter.put('/update-password/:id', isAuthenticated, userController.updateUserPassword)

export default userRouter;