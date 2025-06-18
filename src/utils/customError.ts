export class CustomError extends Error {
  isCustom: boolean;
  status: number;
  errors?: any;

  constructor(message: string, status = 400, errors?: any) {
    super(message);
    this.isCustom = true;
    this.status = status;
    this.errors = errors;
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}