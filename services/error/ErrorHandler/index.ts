import AppError from '../CustomErrors'

type OnTrustedError = (data: any) => Promise<unknown> | unknown

export default class ErrorHandler {
  public async handleError(error: Error, onTrustedError: OnTrustedError): Promise<unknown> {
    console.error('Handling by ErrorHandler', error)

    if (error instanceof AppError && error.isOperational) {
      return onTrustedError?.(error)
    }

    // Process will then get restarted by pm2 in the production env
    process.exit(1)
  }
}
