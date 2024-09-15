import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import handleResponse from "../helpers/handleResponseHelper";

export const handleValidationErrors = (request: Request, response: Response, next: NextFunction) => {
  const errors = validationResult(request);
  
  if (!errors.isEmpty()) {
    return handleResponse(response, 422, "error", "Unprocessable Content", errors.array());
  }

  next();
};