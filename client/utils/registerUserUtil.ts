"use server"

const registerUser = async (userFirstName: string, userLastName: string, userEmail: string, userPassword: string, userRole: string) => {
  try {
    const response = await fetch(`${process.env.API_URL}/api/v1/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userFirstName: userFirstName,
        userLastName: userLastName,
        userEmail: userEmail,
        userPassword: userPassword,
        userRole: userRole
      })
    });

    return await response.json();
  }

  catch (error) {
    return {
      "statusCode": 500,
      "error": "Internal Server Error",
      "message": "Une erreur s'est produite lors de la création du compte."
    };
  }
}

export default registerUser;