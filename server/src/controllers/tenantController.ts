import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

import handleResponse from "../helpers/handleResponseHelper";
import generateRandomToken from "../utils/generateRandomTokenUtil";
import hashPassword from "../utils/hashPasswordUtil";

const prisma = new PrismaClient();

interface RequestWithUser extends Request {
  user?: any;
}

const getTenants = async (request: RequestWithUser, response: Response) => {
  try {
    const { userId } = request.user;

    const existingTenants = await prisma.tenant.findMany({
      where: {
        landlord_has_tenant: {
          some: {
            landlord_id: userId
          }
        }
      },
      select: {
        tenant_id: true,
        tenant_first_name: true,
        tenant_last_name: true,
        tenant_phone_number: true,
        user: {
          select: {
            user_email: true
          }
        },
        landlord_has_tenant: {
          select: {
            invitation_status: true
          }
        },
        tenancy: {
          where: {
            landlord_id: userId,
            tenancy_end_date: {
              gte: new Date()
            }
          },
          select: {
            unit: {
              select: {
                unit_name: true
              }
            }
          }
        }
      }
    });

    handleResponse(response, 200, "success", "OK", "Locataires récupérés avec succès.", { "tenants": existingTenants });
  }

  catch (error) {
    console.error(error);
    handleResponse(response, 500, "error", "Internal Server Error", "Une erreur s'est produite lors de la récupération des locataires.");
  }
}

const addTenant = async (request: RequestWithUser, response: Response) => {
  try {
    const { userId } = request.user;
    const { tenantFirstName, tenantLastName, tenantPhoneNumber, tenantEmail, tenantIsInvited } = request.body;

    const existingUser = await prisma.user.findUnique({
      where: {
        user_email: tenantEmail
      }
    });

    if (existingUser) {
      if (existingUser.user_type === "tenant") {
        const existingTenant = await prisma.tenant.findFirst({
          where: {
            user_id: existingUser.user_id
          }
        });
  
        if (existingTenant) {
          const existingRelation = await prisma.landlord_has_tenant.findFirst({
            where: {
              landlord_id: userId,
              tenant_id: existingTenant.tenant_id
            }
          });
  
          if (existingRelation) {
            return handleResponse(response, 409, "error", "Conflict", "Le locataire a déjà été ajouté.");
          }
  
          else {
            const newRelation = await prisma.landlord_has_tenant.create({
              data: {
                landlord_id: userId,
                tenant_id: existingTenant.tenant_id,
                invitation_status: tenantIsInvited === "true" ? "pending" : "accepted"
              }
            });
  
            if (tenantIsInvited) {
              // send email
            }

            const addedTenant = await prisma.tenant.findUnique({
              where: {
                tenant_id: existingTenant.tenant_id
              },
              select: {
                tenant_id: true,
                tenant_first_name: true,
                tenant_last_name: true,
                tenant_phone_number: true,
                user: {
                  select: {
                    user_email: true
                  }
                },
                landlord_has_tenant: {
                  select: {
                    invitation_status: true
                  }
                },
                tenancy: {
                  where: {
                    landlord_id: userId,
                    tenancy_end_date: {
                      gte: new Date()
                    }
                  },
                  select: {
                    unit: {
                      select: {
                        unit_name: true
                      }
                    }
                  }
                }
              }
            });

            return handleResponse(response, 200, "success", "OK", "Locataire ajouté avec succès.", { "tenant": addedTenant });
          }
        }
      }

      else {
        return handleResponse(response, 409, "error", "Conflict", "L'adresse email que vous avez saisie ne peut pas être utilisée pour inviter ce locataire.");
      }
    }

    else {
      const generatedPassword = generateRandomToken(16);

      const [newUser, newTenant, newRelation] = await prisma.$transaction(async (prisma) => {
        const newUser = await prisma.user.create({
          data: {
            user_email: tenantEmail,
            user_password: hashPassword(generatedPassword),
            user_type: "tenant"
          }
        });
      
        const newTenant = await prisma.tenant.create({
          data: {
            tenant_first_name: tenantFirstName,
            tenant_last_name: tenantLastName,
            tenant_phone_number: tenantPhoneNumber,
            tenant_verification_token: generateRandomToken(64),
            tenant_verification_completed: false,
            user_id: newUser.user_id
          }
        });
      
        const newRelation = await prisma.landlord_has_tenant.create({
          data: {
            landlord_id: userId,
            tenant_id: newTenant.tenant_id,
            invitation_status: tenantIsInvited === "true" ? "pending" : "not_invited"
          }
        });
      
        return [newUser, newTenant, newRelation];
      });

      if (tenantIsInvited) {
        // send email
      }

      const addedTenant = await prisma.tenant.findUnique({
        where: {
          tenant_id: newTenant.tenant_id
        },
        select: {
          tenant_id: true,
          tenant_first_name: true,
          tenant_last_name: true,
          tenant_phone_number: true,
          user: {
            select: {
              user_email: true
            }
          },
          landlord_has_tenant: {
            select: {
              invitation_status: true
            }
          },
          tenancy: {
            where: {
              landlord_id: userId,
              tenancy_end_date: {
                gte: new Date()
              }
            },
            select: {
              unit: {
                select: {
                  unit_name: true
                }
              }
            }
          }
        }
      });

      return handleResponse(response, 200, "success", "OK", "Locataire ajouté avec succès.", { "tenant": addedTenant });
    }
  }

  catch (error) {
    handleResponse(response, 500, "error", "Internal Server Error", "Une erreur s'est produite lors de la création du locataire.");
  }
}

const updateTenant = async (request: RequestWithUser, response: Response) => {
  try {
    const { userId } = request.user;
    const { tenantId } = request.params;
    const { tenantFirstName, tenantLastName, tenantPhoneNumber } = request.body;

    const existingTenant = await prisma.landlord_has_tenant.findFirst({
      where: {
        landlord_id: userId,
        tenant_id: +tenantId
      }
    });

    if (!existingTenant) {
      handleResponse(response, 404, "error", "Not Found", "Locataire non trouvée.");
    }

    const updatedTenant = await prisma.tenant.update({
      where: {
        tenant_id: +tenantId
      },
      data: {
        tenant_first_name: tenantFirstName,
        tenant_last_name: tenantLastName,
        tenant_phone_number: tenantPhoneNumber
      },
      select: {
        tenant_id: true,
        tenant_first_name: true,
        tenant_last_name: true,
        tenant_phone_number: true,
        user: {
          select: {
            user_email: true
          }
        },
        landlord_has_tenant: {
          select: {
            invitation_status: true
          }
        },
        tenancy: {
          where: {
            landlord_id: userId,
            tenancy_end_date: {
              gte: new Date()
            }
          },
          select: {
            unit: {
              select: {
                unit_name: true
              }
            }
          }
        }
      }
    });

    handleResponse(response, 200, "success", "OK", "Locataire modifié avec succès.", { "tenant": updatedTenant });
  }

  catch (error) {
    handleResponse(response, 500, "error", "Internal Server Error", "Une erreur s'est produite lors de la modification du locataire.");
  }
}

const deleteTenant = async (request: RequestWithUser, response: Response) => {
  try {
    const { userId } = request.user;
    const { tenantId } = request.params;

    const existingTenant = await prisma.tenant.findUnique({
      where: {
        tenant_id: +tenantId
      }
    });

    if (!existingTenant) {
      return handleResponse(response, 404, "error", "Not Found", "Locataire non trouvée.");
    }

    const existingTenancy = await prisma.tenancy.findFirst({
      where: {
        tenant_id: +tenantId
      }
    });

    if (existingTenancy) {
      return handleResponse(response, 409, "error", "Conflict", "Le locataire ne peut pas être supprimé car il est lié à une location active.");
    }

    const landlordRelations = await prisma.landlord_has_tenant.findMany({
      where: {
        tenant_id: +tenantId
      }
    });

    if (landlordRelations.length === 1) {

      await prisma.$transaction(async (prisma) => {
        await prisma.landlord_has_tenant.deleteMany({
          where: {
            tenant_id: +tenantId
          }
        });

        await prisma.tenant.delete({
          where: {
            tenant_id: +tenantId
          }
        });

        await prisma.user.delete({
          where: {
            user_id: existingTenant.user_id
          }
        });
      });
      
      return handleResponse(response, 200, "success", "OK", "Locataire supprimé avec succès.");
    }
    
    else {
      await prisma.landlord_has_tenant.delete({
        where: {
          landlord_id_tenant_id: {
            landlord_id: userId,
            tenant_id: +tenantId
          }
        }
      });

      return handleResponse(response, 200, "success", "OK", "Locataire supprimé avec succès.");
    }
  }

  catch (error) {
    handleResponse(response, 500, "error", "Internal Server Error", "Une erreur s'est produite lors de la suppression du locataire.");
  }
}

const inviteTenant = async (request: RequestWithUser, response: Response) => {
  try {
    const { userId } = request.user;
    const { tenantId } = request.params;

    const existingTenant = await prisma.tenant.findUnique({
      where: {
        tenant_id: +tenantId
      }
    });

    if (!existingTenant) {
      return handleResponse(response, 404, "error", "Not Found", "Locataire non trouvée.");
    }

    const existingRelation = await prisma.landlord_has_tenant.findUnique({
      where: {
        landlord_id_tenant_id: {
          landlord_id: userId,
          tenant_id: +tenantId
        }
      }
    });
    
    if (existingRelation) {
      if (existingRelation.invitation_status !== "not_invited") {
        return handleResponse(response, 409, "error", "Conflict", "Le locataire a déjà été invité.");
      }
      
      else {
        await prisma.landlord_has_tenant.update({
          where: {
            landlord_id_tenant_id: {
              landlord_id: userId,
              tenant_id: +tenantId
            }
          },
          data: {
            invitation_status: "pending"
          }
        });

        // send email

        return handleResponse(response, 200, "success", "OK", "Locataire invité avec succès.");
      }
    }
    
    else {
      return handleResponse(response, 404, "error", "Not Found", "Aucune relation n'existe avec ce locataire.");
    }
  }

  catch (error) {
    handleResponse(response, 500, "error", "Internal Server Error", "Une erreur s'est produite lors de la invitation du locataire.");
  }
}

export { getTenants, addTenant, updateTenant, deleteTenant, inviteTenant }