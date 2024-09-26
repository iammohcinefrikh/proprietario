"use server";

import { cookies } from "next/headers";

const loginUser = async (userEmail: string, userPassword: string) => {
  try {
    const response = await fetch(`${process.env.API_URL}/api/v1/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userEmail: userEmail,
        userPassword: userPassword
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return data;
    }

    else {
      const accessToken = data?.jwtToken;
      const csrfToken = data?.csrfToken;

      cookies().set("access_token", accessToken, {
        domain: process.env.DOMAIN_URL,
        maxAge: 3600,
        httpOnly: true,
        path: "/",
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production"
      });

      cookies().set("csrf_token", csrfToken, {
        domain: process.env.DOMAIN_URL,
        maxAge: 3600,
        httpOnly: true,
        path: "/",
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production"
      });

      return {
        "statusCode": 200,
        "success": "OK",
        "message": "Connecté avec succès.",
        "url": data?.userRole
      }
    }
  }

  catch (error) {
    return {
      "statusCode": 500,
      "error": "Internal Server Error",
      "message": "Une erreur s'est produite lors de votre connexion."
    };
  }
}

export default loginUser;