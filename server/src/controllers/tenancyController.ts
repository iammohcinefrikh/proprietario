import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

import handleResponse from "../helpers/handleResponseHelper";
import sendEmail from "../utils/sendEmailUtil";

const prisma = new PrismaClient();

interface RequestWithUser extends Request {
  user?: any;
}

const getTenancies = async (request: RequestWithUser, response: Response) => {
  try {
    const { userId } = request.user;

    const tenancies = await prisma.tenancy.findMany({
      where: { 
        landlord_id: userId
      },
      include: {
        tenant: {
          select: {
            tenant_id: true,
            tenant_first_name: true,
            tenant_last_name: true
          }
        },
        unit: {
          select: {
            unit_id: true,
            unit_name: true
          }
        }
      }
    });

    handleResponse(response, 200, "success", "OK", "Locations récupérées avec succès.", { "tenancies": tenancies });
  }
  
  catch (error) {
    handleResponse(response, 500, "error", "Internal Server Error", "Une erreur s'est produite lors de la récupération des locations.");
  }
};

const addTenancy = async (request: RequestWithUser, response: Response) => {
  try {
    const { userId } = request.user;
    const { tenancyName, tenancyStartDate, tenancyEndDate, tenancyAmount, unitId, tenantId } = request.body;


    const existingUnit = await prisma.unit.findUnique({
      where: {
        unit_id: +unitId
      }
    });

    if (!existingUnit) {
      return handleResponse(response, 404, "error", "NotFound", "Propriété non trouvée.");
    }

    const existingTenant = await prisma.tenant.findUnique({
      where: {
        tenant_id: +tenantId
      },
      include: {
        user: true
      }
    });

    if (!existingTenant) {
      return handleResponse(response, 404, "error", "NotFound", "Locataire non trouvé.");
    }

    const existingRelation = await prisma.landlord_has_tenant.findUnique({
      where: {
        landlord_id_tenant_id: {
          landlord_id: userId,
          tenant_id: +tenantId,
        },
      },
    });

    if (!existingRelation) {
      return handleResponse(response, 404, "error", "Not Found", "Aucune relation n'existe avec ce locataire.");
    }

    const existingTenancy = await prisma.tenancy.findFirst({
      where: {
        unit_id: +unitId,
        tenancy_end_date: {
          gte: new Date()
        }
      }
    });

    if (existingTenancy) {
      return handleResponse(response, 409, "error", "Conflict", "Cette propriété a déjà un locataire actif.");
    }

    const newTenancy = await prisma.tenancy.create({
      data: {
        tenancy_name: tenancyName,
        tenancy_start_date: new Date(tenancyStartDate),
        tenancy_end_date: new Date(tenancyEndDate),
        tenancy_amount: tenancyAmount,
        unit_id: +unitId,
        landlord_id: userId,
        tenant_id: +tenantId
      }
    });

    if (existingTenant.user.user_active) {
      // send email
    }

    handleResponse(response, 201, "success", "Created", "Location créée avec succès", { "tenancy": newTenancy });
  }

  catch (error) {
    handleResponse(response, 500, "error", "Internal Server Error", "Une erreur s'est produite lors de la création de la location.");
  }
}

const updateTenancy = async (request: RequestWithUser, response: Response) => {
  try {
    const { userId } = request.user;
    const { tenancyId } = request.params;
    const { tenancyName, tenancyStartDate, tenancyEndDate, tenancyAmount, unitId, tenantId } = request.body;

    const existingTenancy = await prisma.tenancy.findUnique({
      where: {
        tenancy_id: +tenancyId,
        landlord_id: userId,
        tenant_id: +tenantId
      }
    });

    if (!existingTenancy) {
      return handleResponse(response, 404, "error", "NotFound", "Location non trouvée.");
    }

    const updatedTenancy = await prisma.tenancy.update({
      where: {
        tenancy_id: +tenancyId,
        landlord_id: userId,
        tenant_id: +tenantId
      },
      data: {
        tenancy_name: tenancyName,
        tenancy_start_date: new Date(tenancyStartDate),
        tenancy_end_date: new Date(tenancyEndDate),
        tenancy_amount: tenancyAmount,
        unit_id: +unitId,
        tenant_id: +tenantId
      }
    });

    // send email

    handleResponse(response, 200, "success", "Tenancy updated successfully", { "tenancy": updatedTenancy });
  }

  catch (error) {
    handleResponse(response, 500, "error", "Internal Server Error", "Une erreur s'est produite lors de la modification de la location.");
  }
}

const deleteTenancy = async (request: RequestWithUser, response: Response) => {
  try {

  }

  catch (error) {
    handleResponse(response, 500, "error", "Internal Server Error", "Une erreur s'est produite lors de la suppression de la location.");
  }
}

export { getTenancies, addTenancy, updateTenancy, deleteTenancy }