import { param, body } from "express-validator";

const validateParameter = [
  param("tenancyId")
  .exists().withMessage("tenancyId doit être fourni.")
  .notEmpty().withMessage("tenancyId ne peut pas être vide.")
  .escape()
  .isInt().withMessage("tenancyId doit être un nombre entier.")
];

const validateTenancy = [
  body("tenancyName")
  .exists().withMessage("tenancyName est nécessaire.")
  .notEmpty().withMessage("tenancyName ne peut pas être vide.")
  .escape()
  .isString().withMessage("tenancyName doit être une chaîne de caractères.")
  .isLength({ max: 64 }).withMessage("tenancyName est trop long, veuillez en saisir un plus court."),

  body("tenancyStartDate")
    .exists().withMessage("tenancyStartDate est nécessaire.")
    .notEmpty().withMessage("tenancyStartDate ne peut pas être vide.")
    .isISO8601().withMessage("tenancyStartDate doit être une date valide."),

  body("tenancyEndDate")
    .exists().withMessage("tenancyEndDate est nécessaire.")
    .notEmpty().withMessage("tenancyEndDate ne peut pas être vide.")
    .isISO8601().withMessage("tenancyEndDate doit être une date valide."),

  body("tenancyAmount")
  .exists().withMessage("tenancyAmount est nécessaire.")
  .notEmpty().withMessage("tenancyAmount ne peut pas être vide.")
  .matches(/^\d+(\.\d{1,2})?$/).withMessage("tenancyAmount doit être un montant valide (ex: 1000.00)."),

  body("unitId")
  .exists().withMessage("unitId est nécessaire.")
  .notEmpty().withMessage("unitId ne peut pas être vide.")
  .isInt().withMessage("unitId doit être un nombre entier."),

  body("tenantId")
  .exists().withMessage("tenantId est nécessaire.")
  .notEmpty().withMessage("tenantId ne peut pas être vide.")
  .isInt().withMessage("tenantId doit être un nombre entier."),
];

export { validateParameter, validateTenancy };