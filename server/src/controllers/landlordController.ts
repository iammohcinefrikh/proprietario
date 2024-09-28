import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

import handleResponse from "../helpers/handleResponseHelper";

const prisma = new PrismaClient();

interface RequestWithUser extends Request {
  user?: any;
}

const getLandlords = async (request: RequestWithUser, response: Response) => {
  try {
    const { userId } = request.user;

    const existingLandlords = await prisma.landlord_has_tenant.findMany({
      where: {
        tenant_id: userId
      },
      select: {
        landlord: {
          select: {
            landlord_id: true,
            landlord_first_name: true,
            landlord_last_name: true,
            landlord_phone_number: true,
            user: {
              select: {
                user_email: true
              }
            }
          }
        }
      }
    });

    handleResponse(response, 200, "success", "OK", "Propriétaires récupérés avec succès.", { "landlords": existingLandlords });
  }

  catch (error) {
    handleResponse(response, 500, "error", "Internal Server Error", "Une erreur s'est produite lors de la récupération des propriétaires.");
  }
}

export default getLandlords;