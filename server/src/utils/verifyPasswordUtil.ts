import crypto from "crypto";

const verifyPassword = (enteredPassword: string, storedPassword: string) => {
  const [salt, storedHash] = storedPassword.split("$");
  const hash = crypto.pbkdf2Sync(enteredPassword, salt, 1000, 64, "sha512").toString("hex");

  return hash === storedHash;
}

export default verifyPassword;