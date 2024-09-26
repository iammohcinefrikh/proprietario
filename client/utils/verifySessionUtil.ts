"use server";

const verifySession = async (accessToken: string) => {
  try {
    const response = await fetch(`${process.env.API_URL}/api/v1/session/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        "error": true,
        "message": "Échec de la vérification de la session."
      };
    }

    return {
      "success": true,
      "message": "Vérification de la session réussie.",
      "role": data?.userRole
    };
  }
  
  catch (error) {
    return {
      "error": true,
      "message": "Une erreur s'est produite lors de la vérification de la session."
    };
  }
};

export default verifySession;