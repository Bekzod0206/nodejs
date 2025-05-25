import jwt from "jsonwebtoken"
import { TokenModel } from "../models/token.model.js"

class TokenServiceClass {
  generateToken(payload){
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_KEY, {expiresIn: "15m"})
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_KEY, {expiresIn: "30d"})

    return {accessToken, refreshToken}
  }

  async saveToken(userId, refreshToken) {
    const existToken = await TokenModel.findOne({user: userId})
    if(existToken){
      existToken.refreshToken = refreshToken
      return existToken.save()
    }

    const token = await TokenModel.create({user: userId, refreshToken})
    return token
  }

  async removeToken(refreshToken) {
    return await TokenModel.findOneAndDelete({refreshToken})
  }

  async findToken (refreshToken) {
    return await TokenModel.findOne({refreshToken})
  }

  verifyRefreshToken(token){
    try {
      return jwt.verify(token, process.env.JWT_REFRESH_KEY)
    } catch (error) {
      return null
    }
  }

  verifyAccessToken(token){
    try {
      return jwt.verify(token, process.env.JWT_ACCESS_KEY)
    } catch (error) {
      return null
    }
  }
}

const TokenService = new TokenServiceClass()
export {TokenService}