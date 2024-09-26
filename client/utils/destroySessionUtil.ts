"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const destroySession = async () => {
  cookies().set("access_token", "", {
    domain: process.env.DOMAIN_URL,
    expires: new Date(0),
    httpOnly: true,
    path: "/",
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production"
  });

  cookies().set("csrf_token", "", {
    domain: process.env.DOMAIN_URL,
    expires: new Date(0),
    httpOnly: true,
    path: "/",
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production"
  });

  redirect("/login");
};

export default destroySession;