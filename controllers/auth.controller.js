import { BaseErrorClass } from "../errors/base.error.js"
import { AuthService } from "../services/auth.service.js"
import { validationResult } from "express-validator"

class AuthControllerClass {
  async register (req, res, next) {
    try {
      const errors = validationResult(req)
      if(!errors.isEmpty()){
        return next(BaseErrorClass.BadRequest('Error with validation', errors.array()))
      }
      const {email, password} = req.body
      const data = await AuthService.register(email, password)
      res.cookie("refreshToken", data.refreshToken, {httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000})
      return res.json(data)
    } catch (error) {
      next(error)
    }
  }

  async activation (req, res, next) {
    try {
      const userId = req.params.id
      await AuthService.activation(userId)
      return res.redirect(process.env.CLIENT_URL)
    } catch (error) {
      next(error)
    }
  }

  async login (req, res, next) {
    try {
      const {email, password} = req.body
      const data = await AuthService.login(email, password)
      res.cookie("refreshToken", data.refreshToken, {httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000})
      return res.json(data)
    } catch (error) {
      next(error)
    }
  }

  async logout (req, res, next) {
    try {
      const {refreshToken} = req.cookies
      const token = await AuthService.logout(refreshToken)
      res.clearCookie('refreshCookie')
      return res.json({token})
    } catch (error) {
      next(error)
    }
  }

  async refresh (req, res, next) {
    try {
      const {refreshToken} = req.cookies
      const data = await AuthService.refresh(refreshToken)
      res.cookie("refreshToken", data.refreshToken, {httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000})
      return res.json(data)
    } catch (error) {
      next(error)
    }
  }

  async getuser (req, res, next) {
    try {
      const data = await AuthService.getUsers()
      return res.json(data)
    } catch (error) {
      next(error)
    }
  }

  async forgotPassword(req, res, next){
    try {
      await AuthService.forgotPassword(req.body.email)
      return res.json({success: true})
    } catch (error) {
      next(error)
    }
  }

  async recoveryAccount(req, res, next) {
    try {
      const {token, password} = req.body
      await AuthService.recoveryAccount(token, password)
      return res.json({success: true})
    } catch (error) {
      next(error)
    }
  }

}

const AuthController = new AuthControllerClass()
export {AuthController}