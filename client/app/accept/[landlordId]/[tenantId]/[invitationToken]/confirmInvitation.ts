"use server";

const confirmInvitation = async (landlordId: number, tenantId: number, tenantPassword: string, invitationToken: string) => {
  try {
    const response = await fetch(`${process.env.API_URL}/api/v1/invitation/confim`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        landlordId: landlordId,
        tenantId: tenantId,
        tenantPassword: tenantPassword,
        invitationToken: invitationToken
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
    console.log(error);
    return {
      statusCode: 500,
      error: "Internal Server Error",
      message: "Une erreur s'est produite lors de l'acceptation de l'invitation."
    };
  }
}

export default confirmInvitation;