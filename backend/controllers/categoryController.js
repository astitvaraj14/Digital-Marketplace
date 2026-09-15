const Category = require("../models/Category");

const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });

    res.json({
      count: categories.length,
      categories
    });
  } catch (error) {
    next(error);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const { name, description = "" } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Category name is required"
      });
    }

    const existingCategory = await Category.findOne({
      name: name.trim()
    });

    if (existingCategory) {
      return res.status(409).json({
        message: "Category already exists"
      });
    }

    const category = await Category.create({
      name: name.trim(),
      description
    });

    res.status(201).json({
      message: "Category created successfully",
      category
    });
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found"
      });
    }

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          message: "Category name cannot be empty"
        });
      }

      category.name = name.trim();
    }

    if (description !== undefined) {
      category.description = description;
    }

    await category.save();

    res.json({
      message: "Category updated successfully",
      category
    });
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found"
      });
    }

    await category.deleteOne();

    res.json({
      message: "Category deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
};
