const createProduct = asyncHandler(async (req, res) => {
  if (!req.user.isApproved) {
    res.status(403);
    throw new Error(
      "Your seller account is not yet approved by admin"
    );
  }

  const {
    categoryId,
    name,
    description,
    price,
    image,
    stock,
    status,
  } = req.body;

  if (!categoryId || !name || price === undefined) {
    res.status(400);
    throw new Error("Category, name and price are required");
  }

  const product = await Product.create({
    sellerId: req.user._id,
    categoryId,
    name,
    description,
    price,
    image,
    stock,
    status: status || "active",
  });

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    data: product,
  });
});