import { param, body } from "express-validator";

const validateParameter = [
  param("unitId")
  .exists().withMessage("Le paramètre unitId doit être fourni.")
  .notEmpty().withMessage("Le paramètre unitId ne peut pas être vide.")
  .escape()
  .isInt().withMessage("Le paramètre unitId doit être un nombre entier.")
];

const validateUnit = [
  body("unitName")
  .exists().withMessage("unitName est nécessaire.")
  .notEmpty().withMessage("unitName ne peut pas être vide.")
  .escape()
  .isString().withMessage("unitName doit être une chaîne de caractères."),

  body("unitType")
  .exists().withMessage("unitType est nécessaire.")
  .notEmpty().withMessage("unitType ne peut pas être vide.")
  .escape()
  .isString().withMessage("unitType doit être une chaîne de caractères.")
  .isIn(["house", "flat", "room", "other"]).withMessage("unitType doit être soit \"house\", soit \"flat\", soit \"room\" ou soit \"other\".")
];

export { validateParameter, validateUnit };