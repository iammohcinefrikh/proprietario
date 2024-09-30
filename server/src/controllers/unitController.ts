import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

import handleResponse from "../helpers/handleResponseHelper";

const prisma = new PrismaClient();

interface RequestWithUser extends Request {
  user?: any;
}

const getUnits = async (request: RequestWithUser, response: Response) => {
  try {
    const { userId, userRole } = request.user;

    if (userRole === "landlord") {
      const existingUnits = await prisma.unit.findMany({
        select: {
          unit_id: true,
          unit_name: true,
          unit_type: true,
          unit_created_at: true
        },
        where: {
          landlord_id: userId
        }
      });
  
      handleResponse(response, 200, "success", "OK", "Unités récupérées avec succès.", { "units": existingUnits });
    }

    else if (userRole === "tenant") {
      const existingUnits = await prisma.unit.findMany({
        where: {
          tenancy: {
            some: {
              tenant_id: userId
            }
          }
        },
        select: {
          unit_id: true,
          unit_name: true,
          unit_type: true,
          landlord: {
            select: {
              landlord_first_name: true,
              landlord_last_name: true
            }
          }
        }
      });

      handleResponse(response, 200, "success", "OK", "Unités récupérées avec succès.", { "units": existingUnits });
    }
  }

  catch (error) {
    handleResponse(response, 500, "error", "Internal Server Error", "Une erreur s'est produite lors de la récupération des unités.");
  }
}

const addUnit = async (request: RequestWithUser, response: Response) => {
  try {
    const { userId } = request.user;
    const { unitName, unitType } = request.body;

    const existingUnit = await prisma.unit.findFirst({
      where: {
        unit_name: unitName
      }
    });

    if (existingUnit) {
      return handleResponse(response, 409, "error", "Conflict", "Une propriété portant ce nom existe déjà.");
    }

    const addedUnit = await prisma.unit.create({
      select: {
        unit_id: true,
        unit_name: true,
        unit_type: true,
        unit_created_at: true
      },
      data: {
        unit_name: unitName,
        unit_type: unitType,
        landlord_id: userId
      }
    });

    handleResponse(response, 200, "success", "OK", "Propriété ajoutée avec succès.", { "unit": addedUnit });
  }

  catch (error) {
    handleResponse(response, 500, "error", "Internal Server Error", "Une erreur s'est produite lors de la création de la propriété.");
  }
}

const updateUnit = async (request: RequestWithUser, response: Response) => {
  try {
    const { userId } = request.user;
    const { unitId } = request.params;
    const { unitName, unitType } = request.body;

    const existingUnit = await prisma.unit.findFirst({
      where: {
        unit_id: +unitId,
        landlord_id: userId
      }
    });

    if (!existingUnit) {
      handleResponse(response, 404, "error", "Not Found", "Propriété non trouvée.");
    }

    const updatedUnit = await prisma.unit.update({
      where: {
        unit_id: +unitId
      },
      data: {
        unit_name: unitName,
        unit_type: unitType
      },
      select: {
        unit_id: true,
        unit_name: true,
        unit_type: true,
        unit_created_at: true
      }
    });

    handleResponse(response, 200, "success", "OK", "Propriété modifiée avec succès.", { "unit": updatedUnit });
  }

  catch (error) {
    handleResponse(response, 500, "error", "Internal Server Error", "Une erreur s'est produite lors de la mise à jour de la propriété.");
  }
}

const deleteUnit = async (request: RequestWithUser, response: Response) => {
  try {
    const { userId } = request.user;
    const { unitId } = request.params;

    const existingUnit = await prisma.unit.findFirst({
      where: {
        unit_id: +unitId,
        landlord_id: userId
      }
    });

    if (!existingUnit) {
      handleResponse(response, 404, "error", "Not Found", "Propriété non trouvée.");
    }

    const existingTenancy = await prisma.tenancy.findFirst({
      where: {
        unit_id: +unitId
      }
    });

    if (existingTenancy) {
      return handleResponse(response, 409, "error", "Conflict", "La propriété ne peut pas être supprimée car elle est liée à une location active.");
    }

    await prisma.unit.delete({
      where: {
        unit_id: +unitId
      }
    });

    handleResponse(response, 200, "success", "OK", "Propriété supprimée avec succès.");
  } 
  
  catch (error) {
    handleResponse(response, 500, "error", "Internal Server Error", "Une erreur s'est produite lors de la suppression de la propriété.");
  }
};

export { getUnits, addUnit, updateUnit, deleteUnit };