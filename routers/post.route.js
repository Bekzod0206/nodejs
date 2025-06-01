import express from "express"
import { PostController } from "../controllers/post.controller.js";
const postRouter = express.Router()
import authMiddleware from "../middlewares/auth.middleware.js"
import authorMiddleware from "../middlewares/author.middleware.js";

postRouter.get('/get', PostController.getAll)
postRouter.post('/create',authMiddleware, PostController.create)
postRouter.delete('/delete/:id', authMiddleware, authorMiddleware, PostController.delete)
postRouter.put('/edit/:id', authMiddleware, authorMiddleware, PostController.edit)
postRouter.get('/get-one/:id', PostController.getOne)


export {postRouter}