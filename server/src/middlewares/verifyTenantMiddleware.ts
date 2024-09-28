import { Request, Response, NextFunction } from "express";
import handleResponse from "../helpers/handleResponseHelper";

interface RequestWithUser extends Request {
  user?: any;
}

const verifyTenant = (request: RequestWithUser, response: Response, next: NextFunction) => {
  const { userRole } = request.user;

  if (userRole !== "tenant") {
    return handleResponse(response, 403, "error", "Forbidden", "L'accès est limité aux propriétaires.");
  }

  next();
};

export default verifyTenant;