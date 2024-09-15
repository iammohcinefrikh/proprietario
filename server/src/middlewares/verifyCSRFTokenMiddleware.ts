import { Request, Response, NextFunction } from "express";
import crypto from "crypto";

import handleResponse from "../helpers/handleResponseHelper";

interface RequestWithUser extends Request {
  user?: any;
}

function verifyCSRFToken(request: RequestWithUser, response: Response, next: NextFunction) {
  const csrfToken = request.headers["x-csrf-token"];

  if (!csrfToken) {
    return handleResponse(response, 401, "error", "Unauthorized", "Authentication failed.");
  }

  try {
    const csrfTokenHash = crypto.createHash("sha256").update(csrfToken.toString()).digest("hex");
    
    if (csrfTokenHash !== request.user.csrfTokenHash) {
      return handleResponse(response, 403, "error", "Forbidden", "Authentication failed.");
    }

    next();
  }
  
  catch (error) {
    return handleResponse(response, 500, "error", "Internal Server Error", "An unexpected error occurred.");
  }
}

export default verifyCSRFToken;