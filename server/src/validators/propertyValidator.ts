import { param, body } from "express-validator";

const validateParameter = [
  param("propertyId")
  .exists().withMessage("Le paramètre property-id doit être fourni.")
  .notEmpty().withMessage("Le paramètre property-id ne peut pas être vide.")
  .escape()
  .isInt().withMessage("Le paramètre property-id doit être un nombre entier")
];

const validateProperty = [
  body("propertyName")
  .exists().withMessage("propertyName est nécessaire.")
  .notEmpty().withMessage("propertyName ne peut pas être vide.")
  .escape()
  .isString().withMessage("propertyName doit être une chaîne de caractères."),

  body("propertyType")
  .exists().withMessage("propertyType est nécessaire.")
  .notEmpty().withMessage("propertyType ne peut pas être vide.")
  .escape()
  .isString().withMessage("propertyType doit être une chaîne de caractères.")
  .isIn(["appartement", "house", "building"]).withMessage("propertyType doit être soit \"appartement\", soit \"house\", soit \"building\"."),

  body("propertyAddress")
  .exists().withMessage("propertyAddress est nécessaire.")
  .notEmpty().withMessage("propertyAddress ne peut pas être vide.")
  .escape()
  .isString().withMessage("propertyAddress doit être une chaîne de caractères.")
  .isLength({ min: 1, max: 128 }).withMessage("propertyAddress ne doit pas comporter plus de 128 caractères et moins de 2 caractères."),

  body("propertyCity")
  .exists().withMessage("propertyCity est nécessaire.")
  .notEmpty().withMessage("propertyCity ne peut pas être vide.")
  .escape()
  .isString().withMessage("propertyCity doit être une chaîne de caractères.")
  .isLength({ min: 1, max: 32 }).withMessage("propertyCity ne doit pas comporter plus de 32 caractères et moins de 2 caractères."),

  body("propertyPostalCode")
  .exists().withMessage("propertyPostalCode est nécessaire.")
  .notEmpty().withMessage("propertyPostalCode ne peut pas être vide.")
  .escape()
  .isInt().withMessage("propertyPostalCode doit être un nombre entier")
];

export { validateParameter, validateProperty };