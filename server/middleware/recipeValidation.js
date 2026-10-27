
const { body, param, validationResult } = require('express-validator');
const { LIMITS } = require('../models/Recipe');

const toList = (value) => {
  if (value === undefined || value === null) return [];
  const list = Array.isArray(value) ? value : [value];
  return list.map((item) => String(item).trim());
};

const textFields = [
  ['title', 'Title', LIMITS.title],
  ['description', 'Description', LIMITS.description],
  ['cuisine', 'Cuisine', LIMITS.cuisine],
  ['category', 'Category', LIMITS.category],
];

const numberFields = [
  ['preparationTime', 'Preparation time', LIMITS.minutes],
  ['cookingTime', 'Cooking time', LIMITS.minutes],
  ['servings', 'Servings', LIMITS.servings],
];

const listFields = [
  ['ingredients', 'Ingredients', LIMITS.ingredient],
  ['instructions', 'Instructions', LIMITS.instruction],
];

const validateText = (field, label, max) =>
  body(field)
    .trim()
    .notEmpty()
    .withMessage(`${label} is required`)
    .bail()
    .isLength({ max })
    .withMessage(`${label} must be ${max} characters or fewer`);

const validateNumber = (field, label, max) =>
  body(field)
    .isInt({ min: 1, max })
    .withMessage(`${label} must be a whole number between 1 and ${max}`)
    .toInt();

const validateList = (field, label, maxLength) =>
  body(field)
    .customSanitizer(toList)
    .isArray({ min: 1, max: LIMITS.listItems })
    .withMessage(
      `${label} must contain between 1 and ${LIMITS.listItems} entries`
    )
    .bail()
    .custom((items) =>
      items.every((item) => item.length > 0 && item.length <= maxLength)
    )
    .withMessage(
      `${label} entries must be non-empty and at most ${maxLength} characters`
    );

const validateRecipe = [
  ...textFields.map(([field, label, max]) =>
    validateText(field, label, max)
  ),
  ...numberFields.map(([field, label, max]) =>
    validateNumber(field, label, max)
  ),
  ...listFields.map(([field, label, max]) =>
    validateList(field, label, max)
  ),
];

const validateRecipeId = [
  param('id').custom((id) => {
    const valid =
      typeof id === 'string' &&
      /^[a-f\d]{24}$/i.test(id);

    if (!valid) {
      throw new Error('Invalid recipe ID');
    }

    return true;
  }),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array().map((error) => error.msg).join(', '),
    });
  }

  next();
};

module.exports = {
  validateRecipe,
  validateRecipeId,
  handleValidationErrors,
};