class HttpException extends Error {
  status: number;
  message: string;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.message = message;
  }
}

export class GenericException extends HttpException {
  constructor(error: { status: number; message: string }) {
    super(error.status, error.message);
  }
}
