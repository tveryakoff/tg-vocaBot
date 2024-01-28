export default class AppError extends Error {
  public readonly isOperational: boolean

  constructor(message: string, isOperational: boolean) {
    super(message)

    Object.setPrototypeOf(this, new.target.prototype) // restore prototype chain

    this.isOperational = isOperational

    Error.captureStackTrace(this)
  }
}

type FieldErrorMessages = {
  [fieldName: string]: string
}

export class ValidationError extends AppError {
  public readonly fieldErrorMessages: FieldErrorMessages

  constructor(message: string, fieldErrorMessages: FieldErrorMessages) {
    super(message, true)

    this.fieldErrorMessages = fieldErrorMessages

    Object.setPrototypeOf(this, new.target.prototype) // restore prototype chain

    Error.captureStackTrace(this)
  }
}
