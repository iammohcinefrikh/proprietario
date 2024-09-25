"use server";

import { cookies } from "next/headers";

const modifyTenant = async (tenantId: number, tenantFirstName: string, tenantLastName: string, tenantPhoneNumber: string) => {
  try {
    const accessToken = cookies().get("access_token")?.value;
    const csrfToken = cookies().get("csrf_token")?.value;

    if (!accessToken || !csrfToken) {
      return {
        "statusCode": 401,
        "error": "Unauthorized",
        "message": "Informations d'authentification non valides."
      };
    }

    const response = await fetch(`${process.env.API_URL}/api/v1/tenant/${tenantId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
        "x-csrf-token": csrfToken
      },
      body: JSON.stringify({
        tenantFirstName: tenantFirstName,
        tenantLastName: tenantLastName,
        tenantPhoneNumber: tenantPhoneNumber
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: data.statusCode,
        error: data.error,
        message: data.message
      };
    }

    return data;
  }

  catch (error) {
    return {
      statusCode: 500,
      error: "Internal Server Error",
      message: "Une erreur s'est produite lors de la création du locataire."
    };
  }
}

export default modifyTenant;