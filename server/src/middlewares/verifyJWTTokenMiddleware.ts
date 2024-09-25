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
      return handleResponse(response, 401, "error", "Unauthorized", "Échec de l'authentification.");
    }
    
    else {
      jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET as string, (error, decoded) => {
        if (error) {
          return handleResponse(response, 403, "error", "Forbidden", "Échec de l'authentification.");
        }

        request.user = decoded;
        next();
      });
    }
  } 
  
  catch (error) {
    return handleResponse(response, 500, "error", "Internal Server Error", "Une erreur inattendue s'est produite lors de l'authentification.");
  }
}

export default verifyJWTToken;