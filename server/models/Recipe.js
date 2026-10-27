const mongoose = require('mongoose');

const LIMITS = {
  title: 100,
  description: 1000,
  cuisine: 50,
  category: 50,
  ingredient: 200,
  instruction: 1000,
  listItems: 50,
  minutes: 10080,
  servings: 100,
};

function noEmptyItems(items) {
  return items.length > 0 && items.every((item) => item.trim().length > 0);
}

const positiveNumber = (label, max) => ({
  type: Number,
  required: [true, `${label} is required`],
  min: [1, `${label} must be greater than 0`],
  max: [max, `${label} cannot be more than ${max}`],
});

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: LIMITS.title,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: LIMITS.description,
    },
    image: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
    cuisine: {
      type: String,
      required: [true, 'Cuisine is required'],
      trim: true,
      maxlength: LIMITS.cuisine,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      maxlength: LIMITS.category,
    },
    preparationTime: positiveNumber('Preparation time', LIMITS.minutes),
    cookingTime: positiveNumber('Cooking time', LIMITS.minutes),
    servings: positiveNumber('Servings', LIMITS.servings),
    ingredients: {
      type: [{ type: String, trim: true, maxlength: LIMITS.ingredient }],
      validate: [noEmptyItems, 'Ingredients cannot be empty'],
    },
    instructions: {
      type: [{ type: String, trim: true, maxlength: LIMITS.instruction }],
      validate: [noEmptyItems, 'Instructions cannot be empty'],
    },
  },
  { timestamps: true }
);

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
module.exports.LIMITS = LIMITS;
