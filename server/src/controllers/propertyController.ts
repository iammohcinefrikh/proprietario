import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

import handleResponse from "../helpers/handleResponseHelper";

const prisma = new PrismaClient();

interface RequestWithUser extends Request {
  user?: any;
}

const getProperties = async (request: RequestWithUser, response: Response) => {
  try {
    const { userId } = request.user;

    const existingProperties = await prisma.property.findMany({
      where: {
        landlord_id: userId
      },
      include: {
        unit: {
          include: {
            tenant_rent_unit: true
          }
        }
      }
    });

    if (!existingProperties.length) {
      return handleResponse(response, 404, "error", "Not Found", "Aucune propriété trouvée.");
    }

    else {
      handleResponse(response, 200, "success", "OK", "Propriétés récupérées avec succès.", { "properties": existingProperties });
    }
  }

  catch (error) {
    handleResponse(response, 500, "error", "Internal Server Error", "Une erreur s'est produite lors de la récupération des propriétés.");
  }
}

const addProperty = async (request: RequestWithUser, response: Response) => {
  try {
    const { userId } = request.user;
    const { propertyName, propertyType, propertyAddress, propertyCity, propertyPostalCode  } = request.body;

    const existingProperty = await prisma.property.findFirst({
      where: {
        property_name: propertyName,
        property_address: propertyAddress,
        property_city: propertyCity,
        property_postal_code: propertyPostalCode,
        landlord_id: userId
      }
    });

    if (existingProperty) {
      return handleResponse(response, 409, "error", "Conflict", "Une propriété avec les mêmes détails existe déjà.");
    }

    const createdProperty = await prisma.property.create({
      data: {
        property_name: propertyName,
        property_type: propertyType,
        property_address: propertyAddress,
        property_city: propertyCity,
        property_postal_code: propertyPostalCode,
        landlord_id: userId
      }
    });

    handleResponse(response, 201, "success", "Created", "Propriété créée avec succès", { "property": createdProperty });
  }

  catch (error) {
    handleResponse(response, 500, "error", "Internal Server Error", "Une erreur s'est produite lors de la création de la propriété.");
  }
}

const updateProperty = async (request: RequestWithUser, response: Response) => {
  try {
    const { userId } = request.user;
    const { propertyId } = request.params;
    const { propertyName, propertyType, propertyAddress, propertyCity, propertyPostalCode } = request.body;

    const existingProperty = await prisma.property.findFirst({
      where: {
        property_id: +propertyId,
        landlord_id: userId
      }
    });

    if (!existingProperty) {
      return handleResponse(response, 404, "error", "Not Found", "Propriété que vous essayez de mettre à jour n'existe pas.");
    }

    await prisma.property.update({
      where: {
        property_id: +propertyId,
      },
      data: {
        property_name: propertyName,
        property_type: propertyType,
        property_address: propertyAddress,
        property_city: propertyCity,
        property_postal_code: propertyPostalCode,
        property_updated_at: new Date().toISOString()
      }
    });

    handleResponse(response, 200, "success", "OK", "Propriété mise à jour avec succès");
  }

  catch (error) {
    handleResponse(response, 500, "error", "Internal Server Error", "Une erreur s'est produite lors de la mise à jour de la propriété.");
  }
}

const deleteProperty = async (request: RequestWithUser, response: Response) => {
  try {
    const { userId } = request.user;
    const { propertyId } = request.params;

    const existingProperty = await prisma.property.findFirst({
      where: {
        property_id: +propertyId,
        landlord_id: userId
      }
    });

    if (!existingProperty) {
      return handleResponse(response, 404, "error", "Not Found", "Propriété que vous essayez de supprimer n'existe pas.");
    }

    const existingUnits = await prisma.unit.findMany({
      where: {
        property_id: existingProperty.property_id
      }
    });

    if (existingUnits.length > 0) {
      const rentedUnits = await prisma.tenant_rent_unit.findMany({
        where: {
          unit_id: {
            in: existingUnits.map((unit) => unit.unit_id)
          }
        }
      });

      if (rentedUnits.length > 0) {
        return handleResponse(response, 409, "error", "Conflict", "Des locataires sont actuellement associés à cette propriété, veuillez d'abord les supprimer.");
      }
    }

    await prisma.property.delete({
      where: {
        property_id: +propertyId,
      }
    });

    handleResponse(response, 200, "success", "Deleted", "Propriété supprimée avec succès.");
  } 
  
  catch (error) {
    handleResponse(response, 500, "error", "Internal Server Error", "Une erreur s'est produite lors de la suppression de la propriété.");
  }
};

export { getProperties, addProperty, updateProperty, deleteProperty };