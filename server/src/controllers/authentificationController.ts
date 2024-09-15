import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

import handleResponse from "../helpers/handleResponseHelper";
import hashPassword from "../utils/hashPasswordUtil";
import verifyPassword from "../utils/verifyPasswordUtil";
import generateJWTToken from "../utils/generateJWTTokenUtil";
import generateCSRFToken from "../utils/generateCSRFTokenUtil";

const prisma = new PrismaClient();

interface RequestWithUser extends Request {
  user?: any;
}

const register = async (request: Request, response: Response) => {
  try {
    const { userEmail, userPassword, userFirstName, userLastName, userType } = request.body;

    const existingUser = await prisma.user.findUnique({
      where: {
        user_email: userEmail
      }
    });

    if (existingUser) {
      return handleResponse(response, 409, "error", "Conflict", "Cette adresse électronique est déjà utilisée, veuillez essayer d'en utiliser une autre.");
    }

    else {
      const hashedPassword = hashPassword(userPassword);

      await prisma.$transaction(async (prisma) => {
        const registeredUser = await prisma.user.create({
          data: {
            user_email: userEmail,
            user_password: hashedPassword,
            user_type: userType,
          }
        });
  
        await prisma.landlord.create({
          data: {
            user_id: registeredUser.user_id,
            landlord_first_name: userFirstName,
            landlord_last_name: userLastName,
          }
        });
      });

      handleResponse(response, 201, "success", "Created", "Compte créé avec succès.");
    }
  }

  catch (error) {
    handleResponse(response, 500, "error", "Internal Server Error", "Une erreur s'est produite lors de la création du compte.");
  }
}

const login = async (request: Request, response: Response) => {
  try {
    const { userEmail, userPassword } = request.body;

    const existingUser = await prisma.user.findUnique({
      where: {
          user_email: userEmail
      }
    });

    if (!existingUser) {
      return handleResponse(response, 401, "error", "Unauthorized", "Informations d'identification de compte non valides.");
    }

    else {
      const matchingPassword = verifyPassword(userPassword, existingUser.user_password);

      if (!matchingPassword) {
        return handleResponse(response, 401, "error", "Unauthorized", "Informations d'identification de compte non valides.");
      }

      else {
        if (existingUser.user_type === "landlord") {
          const existingLandlord = await prisma.landlord.findFirst({
            where: {
              user_id: existingUser.user_id
            }
          });

          const csrfToken = generateCSRFToken();

          const accessToken = generateJWTToken({ userId: existingLandlord?.landlord_id, userEmail: existingUser.user_email, userRole: "landlord", csrfTokenHash: csrfToken.csrfTokenHash }, process.env.ACCESS_TOKEN_SECRET as string, "1h");

          handleResponse(response, 200, "success", "OK", "Jetons générés avec succès.", { "userRole": "landlord", "jwtToken": accessToken, "csrfToken": csrfToken.csrfToken });
        }

        else if (existingUser.user_type === "tenant") {
          const existingTenant = await prisma.tenant.findFirst({
            where: {
              user_id: existingUser.user_id
            }
          });

          const csrfToken = generateCSRFToken();

          const accessToken = generateJWTToken({ userId: existingTenant?.tenant_id, userEmail: existingUser.user_email, userRole: "tenant", csrfTokenHash: csrfToken.csrfTokenHash }, process.env.ACCESS_TOKEN_SECRET as string, "1h");

          handleResponse(response, 200, "success", "OK", "Jetons générés avec succès.", { "userRole": "tenant", "jwtToken": accessToken, "csrfToken": csrfToken.csrfToken });
        }
      }
    }
  }

  catch (error) {
    handleResponse(response, 500, "error", "Internal Server Error", "Une erreur s'est produite lors de la connexion au compte.");
  }
}

const verify = (request: RequestWithUser, response: Response) => {
  try {
    const { userRole } = request?.user;

    handleResponse(response, 200, "success", "OK", "Le jeton d'accès est valide.", { "userRole": userRole });
  }

  catch (error) {
    handleResponse(response, 500, "error", "Internal Server Error", "Une erreur s'est produite lors de la vérification de la session de l'utilisateur.");
  }
}

export { register, login, verify };