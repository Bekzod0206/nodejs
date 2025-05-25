import { BaseErrorClass } from "../errors/base.error.js";
import { TokenService } from "../services/token.service.js";

export default function (req, res, next) {
  try {
    const authorization = req.headers.authorization
    if(!authorization){
      return next(BaseErrorClass.UnauthorizedError())
    }

    const accessToken = authorization.split(' ')[1]
    if(!accessToken) {
      return next(BaseErrorClass.UnauthorizedError())
    }

    const userData = TokenService.verifyAccessToken(accessToken)
    if(!userData) {
      return next(BaseErrorClass.UnauthorizedError())
    }
    req.user = userData
    next()
  } catch (error) {
    next(BaseErrorClass.UnauthorizedError())
  }
}