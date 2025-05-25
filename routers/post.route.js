import express from "express"
import { PostController } from "../controllers/post.controller.js";
const postRouter = express.Router()
import authMiddleware from "../middlewares/auth.middleware.js"
import authorMiddleware from "../middlewares/author.middleware.js";

postRouter.get('/get', PostController.getAll)
postRouter.post('/create', PostController.create) //authMiddleware,
postRouter.delete('/delete/:id', PostController.delete) // authMiddleware, authorMiddleware
postRouter.put('/edit/:id', PostController.edit) // authMiddleware, authorMiddleware
postRouter.get('/get-one/:id', PostController.getOne)


export {postRouter}