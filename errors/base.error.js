class BaseErrorClass extends Error {
  status;
  errors;

  constructor(status, message, errors = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static UnauthorizedError() {
    return new BaseErrorClass(401, "User is not authorized");
  }

  static BadRequest(message, errors = []) {
    return new BaseErrorClass(400, message, errors);
  }
}

export { BaseErrorClass };
