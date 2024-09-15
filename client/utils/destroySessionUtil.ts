"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const destroySession = async () => {
  cookies().delete("access_token");
  cookies().delete("csrf_token");

  redirect("/login");
};

export default destroySession;