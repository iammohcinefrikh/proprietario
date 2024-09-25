"use server";

const activateAccount = async (userId: number, verificationToken: string) => {
  try {
    const response = await fetch(`${process.env.API_URL}/api/v1/activate/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId: userId,
        verificationToken: verificationToken
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
      message: "Une erreur s'est produite lors de l'activation du compte."
    };
  }
}

export default activateAccount;