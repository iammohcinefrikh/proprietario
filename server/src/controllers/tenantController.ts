import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

import handleResponse from "../helpers/handleResponseHelper";
import generateRandomToken from "../utils/generateRandomTokenUtil";
import hashPassword from "../utils/hashPasswordUtil";
import sendEmail from "../utils/sendEmailUtil";

const prisma = new PrismaClient();

interface RequestWithUser extends Request {
  user?: any;
}

const getTenants = async (request: RequestWithUser, response: Response) => {
  try {
    const { userId } = request.user;

    const existingTenants = await prisma.landlord_has_tenant.findMany({
      where: {
        landlord_id: userId,
      },
      select: {
        tenant_id: true,
        tenant_first_name: true,
        tenant_last_name: true,
        tenant_phone_number: true,
        tenant_invitation_status: true,
        tenant: {
          select: {
            user: {
              select: {
                user_email: true
              }
            },
            tenancy: {
              where: {
                tenancy_end_date: {
                  gte: new Date(),
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
        }
      }
    });

    handleResponse(response, 200, "success", "OK", "Locataires récupérés avec succès.", { "tenants": existingTenants });
  }

  catch (error) {
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
                tenant_first_name: tenantFirstName,
                tenant_last_name: tenantLastName,
                tenant_phone_number: tenantPhoneNumber,
                tenant_invitation_status: tenantIsInvited === "true" ? "pending" : "not_invited",
                tenant_invitation_token: generateRandomToken(64)
              }
            });
  
            if (tenantIsInvited === "true") {
              const existingLandlord = await prisma.landlord.findFirst({
                where: {
                  landlord_id: userId
                }
              });

              sendEmail(`${existingLandlord?.landlord_first_name} ${existingLandlord?.landlord_last_name} via Proprietario`, tenantEmail, "Invitation à ouvrir votre compte Proprietario", `
                <p>Bonjour ${tenantFirstName},<p>
                <p>${existingLandlord?.landlord_first_name} ${existingLandlord?.landlord_last_name} vous invite à utiliser Proprietario, une application qui aide les propriétaires et les locataires dans leurs interactions quotidiennes.</p>

                <p>Veuillez cliquer sur ce qui suit pour accepter l'invitation et confirmer votre inscription: <a href="${process.env.DOMAIN_URL}/accept/${userId}/${existingTenant.tenant_id}/${newRelation.tenant_invitation_token}">${process.env.DOMAIN_URL}/accept/${userId}/${existingTenant.tenant_id}/${newRelation.tenant_invitation_token}</a></p>
                
                <p>Cordialement,<br>
                ${existingLandlord?.landlord_first_name} ${existingLandlord?.landlord_last_name} via Proprietario</p>
              `, `
                Bonjour ${tenantFirstName},

                ${existingLandlord?.landlord_first_name} ${existingLandlord?.landlord_last_name} vous invite à utiliser Proprietario, une application qui aide les propriétaires et les locataires dans leurs interactions quotidiennes.

                Veuillez cliquer sur ce qui suit pour accepter l'invitation et confirmer votre inscription: ${process.env.DOMAIN_URL}/accept/${userId}/${existingUser.user_id}/${newRelation.tenant_invitation_token}
                
                Cordialement,
                ${existingLandlord?.landlord_first_name} ${existingLandlord?.landlord_last_name} via Proprietario
              `);
            }

            const addedTenant = await prisma.landlord_has_tenant.findFirst({
              where: {
                tenant_id: existingTenant.tenant_id
              },
              select: {
                tenant_id: true,
                tenant_first_name: true,
                tenant_last_name: true,
                tenant_phone_number: true,
                tenant_invitation_status: true,
                tenant: {
                  select: {
                    user: {
                      select: {
                        user_email: true
                      }
                    },
                    tenancy: {
                      where: {
                        tenancy_end_date: {
                          gte: new Date(),
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
                }
              }
            });

            return handleResponse(response, 200, "success", "OK", "Locataire ajouté avec succès.", { "tenant": addedTenant });
          }
        }

        else {
          return handleResponse(response, 404, "error", "Not Found", "Locataire non trouvé.");
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
            user_type: "tenant",
            user_verification_token: generateRandomToken(64)
          }
        });
      
        const newTenant = await prisma.tenant.create({
          data: {
            tenant_first_name: tenantFirstName,
            tenant_last_name: tenantLastName,
            tenant_phone_number: tenantPhoneNumber,
            user_id: newUser.user_id
          }
        });
      
        const newRelation = await prisma.landlord_has_tenant.create({
          data: {
            landlord_id: userId,
            tenant_id: newTenant.tenant_id,
            tenant_first_name: tenantFirstName,
            tenant_last_name: tenantLastName,
            tenant_phone_number: tenantPhoneNumber,
            tenant_invitation_status: tenantIsInvited === "true" ? "pending" : "not_invited",
            tenant_invitation_token: generateRandomToken(64)
          }
        });
      
        return [newUser, newTenant, newRelation];
      });

      if (tenantIsInvited === "true") {
        const existingLandlord = await prisma.landlord.findFirst({
          where: {
            landlord_id: userId
          }
        });

        sendEmail(`${existingLandlord?.landlord_first_name} ${existingLandlord?.landlord_last_name} via Proprietario`, tenantEmail, "Invitation à ouvrir votre compte Proprietario", `
          <p>Bonjour ${tenantFirstName},<p>
          <p>${existingLandlord?.landlord_first_name} ${existingLandlord?.landlord_last_name} vous invite à utiliser Proprietario, une application qui aide les propriétaires et les locataires dans leurs interactions quotidiennes.</p>

          <p>Veuillez cliquer sur ce qui suit pour accepter l'invitation et confirmer votre inscription: <a href="${process.env.DOMAIN_URL}/accept/${userId}/${newTenant.tenant_id}/${newRelation.tenant_invitation_token}">${process.env.DOMAIN_URL}/accept/${userId}/${newTenant.tenant_id}/${newRelation.tenant_invitation_token}</a></p>
          
          <p>Cordialement,<br>
          ${existingLandlord?.landlord_first_name} ${existingLandlord?.landlord_last_name} via Proprietario</p>
        `, `
          Bonjour ${tenantFirstName},
          ${existingLandlord?.landlord_first_name} ${existingLandlord?.landlord_last_name} vous invite à utiliser Proprietario, une application qui aide les propriétaires et les locataires dans leurs interactions quotidiennes.

          Veuillez cliquer sur ce qui suit pour accepter l'invitation et confirmer votre inscription: ${process.env.DOMAIN_URL}/accept/${userId}/${newUser.user_id}/${newRelation.tenant_invitation_token}
          
          Cordialement,
          ${existingLandlord?.landlord_first_name} ${existingLandlord?.landlord_last_name} via Proprietario
        `);
      }

      const addedTenant = await prisma.landlord_has_tenant.findFirst({
        where: {
          tenant_id: newTenant.tenant_id
        },
        select: {
          tenant_id: true,
          tenant_first_name: true,
          tenant_last_name: true,
          tenant_phone_number: true,
          tenant_invitation_status: true,
          tenant: {
            select: {
              user: {
                select: {
                  user_email: true
                }
              },
              tenancy: {
                where: {
                  tenancy_end_date: {
                    gte: new Date(),
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

    const updatedTenant = await prisma.landlord_has_tenant.update({
      where: {
        landlord_id_tenant_id: {
          landlord_id: userId,
          tenant_id: +tenantId
        }
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
        tenant_invitation_status: true,
        tenant: {
          select: {
            user: {
              select: {
                user_email: true
              }
            },
            tenancy: {
              where: {
                tenancy_end_date: {
                  gte: new Date(),
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

    const existingTenant = await prisma.landlord_has_tenant.findUnique({
      where: {
        landlord_id_tenant_id: {
          landlord_id: userId,
          tenant_id: +tenantId
        }
      },
      select: {
        tenant: {
          select: {
            user: {
              select: {
                user_id: true
              }
            }
          }
        }
      }
    });

    if (!existingTenant) {
      return handleResponse(response, 404, "error", "Not Found", "Locataire non trouvée.");
    }

    const existingTenancy = await prisma.tenancy.findFirst({
      where: {
        landlord_id: userId,
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
            user_id: existingTenant.tenant.user.user_id
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
      if (existingRelation.tenant_invitation_status !== "not_invited") {
        return handleResponse(response, 409, "error", "Conflict", "Le locataire a déjà été invité.");
      }
      
      else {
        const existingTenant = await prisma.landlord_has_tenant.update({
          where: {
            landlord_id_tenant_id: {
              landlord_id: userId,
              tenant_id: +tenantId
            }
          },
          data: {
            tenant_invitation_status: "pending"
          },
          select: {
            tenant_id: true,
            tenant_first_name: true,
            tenant_last_name: true,
            tenant_invitation_token: true,
            tenant: {
              select: {
                user: {
                  select: {
                    user_email: true
                  }
                }
              }
            }
          }
        });

        const existingLandlord = await prisma.landlord.findFirst({
          where: {
            landlord_id: userId
          }
        });

        sendEmail(`${existingLandlord?.landlord_first_name} ${existingLandlord?.landlord_last_name} via Proprietario`, existingTenant.tenant.user.user_email, "Invitation à ouvrir votre compte Proprietario", `
          <p>Bonjour ${existingTenant.tenant_first_name},<p>
          <p>${existingLandlord?.landlord_first_name} ${existingLandlord?.landlord_last_name} vous invite à utiliser Proprietario, une application qui aide les propriétaires et les locataires dans leurs interactions quotidiennes.</p>

          <p>Veuillez cliquer sur ce qui suit pour accepter l'invitation et confirmer votre inscription: <a href="${process.env.DOMAIN_URL}/accept/${userId}/${tenantId}/${existingTenant.tenant_invitation_token}">${process.env.DOMAIN_URL}/accept/${userId}/${tenantId}/${existingTenant.tenant_invitation_token}</a></p>
          
          <p>Cordialement,<br>
          ${existingLandlord?.landlord_first_name} ${existingLandlord?.landlord_last_name} via Proprietario</p>
        `, `
          Bonjour ${existingTenant},
          ${existingLandlord?.landlord_first_name} ${existingLandlord?.landlord_last_name} vous invite à utiliser Proprietario, une application qui aide les propriétaires et les locataires dans leurs interactions quotidiennes.

          Veuillez cliquer sur ce qui suit pour accepter l'invitation et confirmer votre inscription: ${process.env.DOMAIN_URL}/accept/${userId}/${tenantId}/${existingTenant.tenant_invitation_token}
          
          Cordialement,
          ${existingLandlord?.landlord_first_name} ${existingLandlord?.landlord_last_name} via Proprietario
        `);

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