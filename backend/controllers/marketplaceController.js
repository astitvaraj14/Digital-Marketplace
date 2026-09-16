const Product = require("../models/Product");

const getMarketplaceProducts = async (req, res, next) => {
  try {
    const { search = "", category = "", minPrice, maxPrice, sort = "newest" } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    if (category) filter.category = category;

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice);
    }

    let query = Product.find(filter).populate(
      "seller sellerId", "name storeName storeDescription"
    );

    if (sort === "price_asc") query = query.sort({ price: 1 });
    else if (sort === "price_desc") query = query.sort({ price: -1 });
    else query = query.sort({ createdAt: -1 });

    const products = await query;
    res.json({ count: products.length, products });
  } catch (error) {
    next(error);
  }
};

const getCategories = async (req, res, next) => {
  try {
    const categories = await Product.distinct("category");
    res.json({ categories });
  } catch (error) {
    next(error);
  }
};

module.exports = { getMarketplaceProducts, getCategories };
