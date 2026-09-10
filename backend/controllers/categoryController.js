const asyncHandler = require("express-async-handler");
const Category = require("../models/Category");
const Product = require("../models/Product");

const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort("name");
  res.json({ success: true, message: "OK", data: categories });
});

const createCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  if (!name) {
    res.status(400);
    throw new Error("Category name is required");
  }
  const exists = await Category.findOne({ name });
  if (exists) {
    res.status(400);
    throw new Error("Category already exists");
  }
  const category = await Category.create({ name, description });
  res.status(201).json({ success: true, message: "Category created", data: category });
});

const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }
  category.name = req.body.name ?? category.name;
  category.description = req.body.description ?? category.description;
  await category.save();
  res.json({ success: true, message: "Category updated", data: category });
});

const deleteCategory = asyncHandler(async (req, res) => {
  const inUse = await Product.exists({ categoryId: req.params.id });
  if (inUse) {
    res.status(400);
    throw new Error("Cannot delete a category that has products assigned to it");
  }
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }
  res.json({ success: true, message: "Category deleted", data: null });
});

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
