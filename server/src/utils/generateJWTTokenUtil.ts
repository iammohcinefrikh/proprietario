import jwt from "jsonwebtoken";

const generateJWTToken = (payload: object, jwtSecret: string, expiresIn: string | number) => {
  const jwtToken = jwt.sign(payload, jwtSecret, { expiresIn });
  return jwtToken;
}

export default generateJWTToken;