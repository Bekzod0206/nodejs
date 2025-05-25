import { BaseErrorClass } from "../errors/base.error.js";
import PostModel from "../models/post.model.js";

export default async function (req, res, next) {
  try {
    const post = await PostModel.findById(req.params.id)
    const authorId = req.user.id
    if(post.author.toString() !== authorId){
      return next(BaseErrorClass.BadRequest("Only author can edit this post"))
    }
    next()
  } catch (error) {
    return next(BaseErrorClass.BadRequest("Only author can edit this post"))
  }
}