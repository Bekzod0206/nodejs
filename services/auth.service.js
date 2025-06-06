import { UserDto } from "../dtos/user.dto.js"
import { UserModel } from "../models/user.model.js"
import bcrypt from "bcrypt"
import { TokenService } from "./token.service.js"
import { MailService } from "./mail.service.js"
import { BaseErrorClass } from "../errors/base.error.js"

class AuthServiceClass {
  async register (email, password) {
    const existUser = await UserModel.findOne({email})
    if(existUser){
      throw BaseErrorClass.BadRequest("User with such email is already exist")
    }
    const hashPassword = await bcrypt.hash(password, 10)
    const user = await UserModel.create({email, password: hashPassword})
    const userDto = new UserDto(user)

    await MailService.sendActivationMail(email, `${process.env.API_URL}/api/auth/activation/${userDto.id}`)

    const tokens = TokenService.generateToken({...userDto})

    await TokenService.saveToken(userDto.id, tokens.refreshToken)

    return {user: userDto, ...tokens}
  }

  async activation (userId) {
    try {
      const user = await UserModel.findById(userId)
      if(!user){
        throw BaseErrorClass.BadRequest("User does not exist")
      }
      user.isActivated = true
      await user.save()
    } catch (error) {
      BaseErrorClass.BadRequest(error)
    }
  }

  async login (email, password) {
    const user = await UserModel.findOne({email})
    if(!user){
      throw BaseErrorClass.BadRequest("User does not exist")
    }

    const isPassword = await bcrypt.compare(password, user.password)
    if(!isPassword){
      throw BaseErrorClass.BadRequest("Password is incorrect")
    }

    const userDto = new UserDto(user)
    const tokens = TokenService.generateToken({...userDto})
    await TokenService.saveToken(userDto.id, tokens.refreshToken)
    return {user: userDto, ...tokens}

  }

  async logout (refreshToken) {
    return await TokenService.removeToken(refreshToken)
  }

  async refresh(refreshToken) {
    if(!refreshToken){
      throw BaseErrorClass.UnathorizedError("Bad authorization")
    }

    const userPayload = await TokenService.verifyRefreshToken(refreshToken)
    const tokenDB = await TokenService.findToken(refreshToken)
    if(!userPayload || !tokenDB){
      throw BaseError.UnathorizedError("Bad authorization")
    }

    const user = await UserModel.findById(userPayload.id)
    const userDto = new UserDto(user)
    const tokens = TokenService.generateToken({...userDto})
    await TokenService.saveToken(userDto.id, tokens.refreshToken)
    return {user: userDto, ...tokens}
  }

  async getUsers () {
    return await UserModel.find()
  }

  async forgotPassword(email) {
    if(!email){
      throw BaseError.BadRequest("Email is required")
    }

    const user = await UserModel.findOne({email})
    if(!user){
      throw BaseError.BadRequest("User is not defined")
    }
    const userDto = new UserDto(user)
    const tokens = TokenService.generateToken({...userDto})

    await MailService.sendForgotPasswordMail(email, `${process.env.CLIENT_URL}/recovery-account/${tokens.accessToken}`)
    return 200
  }

  async recoveryAccount(token, password) {
    if(!token) {
      throw BaseError.BadRequest("Something went wrong")
    }

    const userData = TokenService.verifyAccessToken(token)
    if(!userData){
      throw BaseError.BadRequest("Expired access")
    }
    const hashPassword = await bcrypt.hash(password, 10)
    await UserModel.findByIdAndUpdate(userData.id, {password: hashPassword})
    return 200
  }

}

const AuthService = new AuthServiceClass()
export {AuthService}