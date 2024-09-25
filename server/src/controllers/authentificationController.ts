import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

import handleResponse from "../helpers/handleResponseHelper";
import hashPassword from "../utils/hashPasswordUtil";
import verifyPassword from "../utils/verifyPasswordUtil";
import generateJWTToken from "../utils/generateJWTTokenUtil";
import generateCSRFToken from "../utils/generateCSRFTokenUtil";
import generateRandomToken from "../utils/generateRandomTokenUtil";
import sendEmail from "../utils/sendEmailUtil";

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

      const [newUser] = await prisma.$transaction(async (prisma) => {
        const newUser = await prisma.user.create({
          data: {
            user_email: userEmail,
            user_password: hashedPassword,
            user_type: userType,
            user_verification_token: generateRandomToken(64)
          }
        });
  
        await prisma.landlord.create({
          data: {
            user_id: newUser.user_id,
            landlord_first_name: userFirstName,
            landlord_last_name: userLastName
          }
        });

        return [newUser];
      });

      sendEmail(`${userFirstName} ${userLastName}`, userEmail, "Bienvenue sur Proprietario!", `
        <p>Bienvenue ${userFirstName},<br>
        Pour confirmer votre compte, veuillez suivre ce lien: <a href="${process.env.DOMAIN_URL}/activate/${newUser.user_id}/${newUser.user_verification_token}">${process.env.DOMAIN_URL}/activate/${newUser.user_id}/${newUser.user_verification_token}</a></p>
        <p>Cordialement,<br>
        L'équipe de Proprietario</p>
      `, `
        Bienvenue ${userFirstName},
        Pour confirmer votre compte, veuillez suivre ce lien: ${process.env.DOMAIN_URL}/activate/${newUser.user_id}/${newUser.user_verification_token}

        Cordialement,
        L'équipe de Proprietario
      `);

      handleResponse(response, 201, "success", "Created", "Compte créé avec succès.");
    }
  }

  catch (error) {
    console.error(error);
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
      if (existingUser.user_active) {
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
      
      else {
        return handleResponse(response, 403, "error", "Forbidden", "Compte non activé");
      }
    }
  }

  catch (error) {
    handleResponse(response, 500, "error", "Internal Server Error", "Une erreur s'est produite lors de la connexion au compte.");
  }
}

const verify = (request: RequestWithUser, response: Response) => {
  try {
    const { userRole } = request.user;

    handleResponse(response, 200, "success", "OK", "Le jeton d'accès est valide.", { "userRole": userRole });
  }

  catch (error) {
    handleResponse(response, 500, "error", "Internal Server Error", "Une erreur s'est produite lors de la vérification de la session de l'utilisateur.");
  }
}

const activate = async (request: Request, response: Response) => {
  try {
    const { userId, verificationToken } = request.body;

    const existingUser = await prisma.user.findUnique({
      where: {
        user_id: +userId
      }
    });

    if (!existingUser) {
      return handleResponse(response, 404, "error", "Not Found", "Identifiants d'activation de compte non valides.");
    }

    if (existingUser.user_verification_completed) {
      return handleResponse(response, 409, "error", "Conflict", "Compte déjà activé.");
    }

    else {
      if (existingUser.user_verification_token === verificationToken) {
        await prisma.user.update({
          where: {
            user_id: +userId
          },
          data: {
            user_verification_completed: true,
            user_verification_token: null,
            user_active: true
          }
        });

        return handleResponse(response, 200, "success", "OK", "Compte activé avec succès.");
      }

      else {
        return handleResponse(response, 401, "error", "Unauthorized", "Identifiants d'activation de compte non valides.");
      }
    }
  }

  catch (error) {
    handleResponse(response, 500, "error", "Internal Server Error", "Une erreur s'est produite lors de l'activation du compte.");
  }
}

export { register, login, verify, activate };