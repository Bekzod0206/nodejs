import PostModel from "../models/post.model.js"
import { FileService } from "./file.service.js"

class PostServiceClass {
  async create(post, picture, author) {
    const fileName = await FileService.save(picture)
    const newPost = await PostModel.create({...post, picture: fileName, author})
    return newPost
  }

  async getAll() {
    const allPosts = await PostModel.find()
    return allPosts
  }

  async delete(id) {
    const post = await PostModel.findByIdAndDelete(id)
    return post
  }

  async edit (post, id) {
    if(!id){
      throw new Error("Id doesn't exist")
    }
    const updatedPost = await PostModel.findByIdAndUpdate(id, post, {new: true})
    return updatedPost
  }

  async getOne (id) {
    const post = await PostModel.findById(id)
    return post
  }
}

const PostService = new PostServiceClass()
export {PostService}