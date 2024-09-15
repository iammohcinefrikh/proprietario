import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

import handleResponse from "../helpers/handleResponseHelper";

interface RequestWithUser extends Request {
  user?: any;
}

function verifyJWTToken(request: RequestWithUser, response: Response, next: NextFunction) {
  try {
    const accessToken = request.headers["authorization"]?.split(" ")[1];

    if (!accessToken) {
      return handleResponse(response, 401, "error", "Unauthorized", "Authentication failed.");
    } 
    
    else {
      jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET as string, (error, decoded) => {
        if (error) {
          return handleResponse(response, 403, "error", "Forbidden", "Authentication failed.");
        }

        request.user = decoded;
        next();
      });
    }
  } 
  
  catch (error) {
    return handleResponse(response, 500, "error", "Internal Server Error", "An unexpected error occurred.");
  }
}

export default verifyJWTToken;