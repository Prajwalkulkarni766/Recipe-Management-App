
const mongoose = require('mongoose');
const Recipe = require('../models/Recipe');
const { uploadImage, deleteImage } = require('../utils/cloudinary');

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

async function findRecipeOrRespond(req, res) {
  const recipe = await Recipe.findById(req.params.id);

  if (!recipe) {
    res.status(404).json({
      success: false,
      message: 'Recipe not found',
    });
    return null;
  }

  return recipe;
}

async function getRecipes(req, res) {
  const { search, cuisine, category } = req.query;
  const filter = {};

  if (typeof search === 'string' && search.trim()) {
    filter.title = {
      $regex: escapeRegex(search.trim()),
      $options: 'i',
    };
  }

  if (typeof cuisine === 'string' && cuisine.trim()) {
    filter.cuisine = {
      $regex: `^${escapeRegex(cuisine.trim())}$`,
      $options: 'i',
    };
  }

  if (typeof category === 'string' && category.trim()) {
    filter.category = {
      $regex: `^${escapeRegex(category.trim())}$`,
      $options: 'i',
    };
  }

  const [recipes, cuisines, categories] = await Promise.all([
    Recipe.find(filter).sort({ updatedAt: -1 }),
    Recipe.distinct('cuisine'),
    Recipe.distinct('category'),
  ]);

  res.json({
    success: true,
    count: recipes.length,
    data: recipes,
    filters: {
      cuisines: cuisines.sort(),
      categories: categories.sort(),
    },
  });
}

async function getRecipeById(req, res) {
  const recipe = await findRecipeOrRespond(req, res);
  if (!recipe) return;

  res.json({
    success: true,
    data: recipe,
  });
}

async function createRecipe(req, res) {
  const {
    title,
    description,
    cuisine,
    category,
    preparationTime,
    cookingTime,
    servings,
    ingredients,
    instructions,
  } = req.body;

  const recipeData = {
    title,
    description,
    cuisine,
    category,
    preparationTime,
    cookingTime,
    servings,
    ingredients,
    instructions,
  };

  const image = req.file
    ? await uploadImage(req.file.buffer)
    : null;

  try {
    const createdRecipe = await Recipe.create({
      ...recipeData,
      ...(image && { image }),
    });

    res.status(201).json({
      success: true,
      message: 'Recipe created successfully',
      data: createdRecipe,
    });
  } catch (error) {
    if (image) await deleteImage(image.publicId);
    throw error;
  }
}

async function updateRecipe(req, res) {
  const existingRecipe = await findRecipeOrRespond(req, res);
  if (!existingRecipe) return;

  const {
    title,
    description,
    cuisine,
    category,
    preparationTime,
    cookingTime,
    servings,
    ingredients,
    instructions,
  } = req.body;

  const recipeData = {
    title,
    description,
    cuisine,
    category,
    preparationTime,
    cookingTime,
    servings,
    ingredients,
    instructions,
  };

  const oldPublicId = existingRecipe.image?.publicId;

  const newImage = req.file
    ? await uploadImage(req.file.buffer)
    : null;

  let updatedRecipe;

  try {
    updatedRecipe = await Recipe.findByIdAndUpdate(
      existingRecipe._id,
      {
        ...recipeData,
        ...(newImage && { image: newImage }),
      },
      {
        new: true,
        runValidators: true,
      }
    );
  } catch (error) {
    if (newImage) await deleteImage(newImage.publicId);
    throw error;
  }

  if (!updatedRecipe) {
    if (newImage) await deleteImage(newImage.publicId);

    return res.status(404).json({
      success: false,
      message: 'Recipe not found',
    });
  }

  if (newImage && oldPublicId) {
    await deleteImage(oldPublicId);
  }

  res.json({
    success: true,
    message: 'Recipe updated successfully',
    data: updatedRecipe,
  });
}

async function deleteRecipe(req, res) {
  const recipe = await findRecipeOrRespond(req, res);
  if (!recipe) return;

  await Recipe.deleteOne({ _id: recipe._id });

  if (recipe.image?.publicId) {
    await deleteImage(recipe.image.publicId);
  }

  res.json({
    success: true,
    message: 'Recipe deleted successfully',
    data: { id: recipe._id },
  });
}

module.exports = {
  getRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
};

