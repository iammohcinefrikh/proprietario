"use server";

const checkInvitation = async (landlordId: number, tenantId: number, activationToken: string) => {
  try {
    const response = await fetch(`${process.env.API_URL}/api/v1/invitation/check`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        landlordId: landlordId,
        tenantId: tenantId,
        activationToken: activationToken
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
      message: "Une erreur s'est produite lors de la vérification de l'invitation."
    };
  }
}

export default checkInvitation;