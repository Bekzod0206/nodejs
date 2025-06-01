import { PostService } from "../services/post.service.js";

class PostControllerClass {
  async getAll (req, res, next) {
    try {
      const allPosts = await PostService.getAll()
      res.status(200).json(allPosts);
    } catch (error) {
      next(error)
    }
  }

  async create (req, res, next) {
    try {
      const post = await PostService.create(req.body, req.files.picture, req.user.id)
      res.status(201).json(post);
    } catch (error) {
      next(error)
    }
  }

  async delete (req, res, next) {
    try {
      const post = await PostService.delete(req.params.id)
      res.status(200).json(post);
    } catch (error) {
      next(error)
    }
  }

  async edit (req, res, next) {
    try {
      const {body, params} = req
      const post = await PostService.edit(body, params.id)
      res.status(200).json(post)
    } catch (error) {
      next(error)
    }
  }

  async getOne (req, res, next) {
    try {
      const post = await PostService.getOne(req.params.id)
      res.status(200).json(post)
    } catch (error) {
      next(error)
    }
  }
}

const PostController = new PostControllerClass()

export {PostController}