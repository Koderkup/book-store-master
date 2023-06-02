const Products = require("../models/productModel");
const Category = require("../models/categoryModel");
// Filter, sorting and paginating

class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filtering() {
    const queryObj = { ...this.queryString }; //queryString = req.query
    const excludedFields = ["page", "sort", "limit"];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lt|lte|regex)\b/g,
      (match) => "$" + match
    );
    let cryteria = JSON.parse(queryStr).category;
    //    gte = greater than or equal
    //    lte = lesser than or equal
    //    lt = lesser than
    //    gt = greater than
    if (cryteria) {
      this.query.find({ category: cryteria });
    } else {
      this.query.find(JSON.parse(queryStr));
    }

    return this;
  }

  sorting() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  paginating() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 9;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

const productCtrl = {
  getProducts: async (req, res) => {
    const pipeline = [
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: "$category",
      },
      {
        $addFields: {
          genre: "$category.name",
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $unwind: "$product",
      },
      {
        $project: {
          _id: "$product._id", // используем _id из products
          product_id: "$product.product_id",
          title: "$product.title",
          price: "$product.price",
          description: "$product.description",
          author: "$product.author",
          images: "$product.images",
          category: "$product.category", // используем category из products, которая уже содержит ObjectId
          quantity: "$product.quantity",
          checked: "$product.checked",
          sold: "$product.sold",
          createdAt: "$product.createdAt",
          updatedAt: "$product.updatedAt",
          __v: "$product.__v",
          genre: "$genre", // добавляем genre из pipeline
        },
      },
    ];
    try {
      const features = new APIfeatures(Products.find(), req.query)
        .filtering()
        .sorting()
        .paginating();

      const products = await features.query;
      //-----------------------------------------------------------------
      const productsWithGenre = await Products.aggregate(pipeline);
      for (let i = 0; i < products.length; i++) {
        const productWithGenre = productsWithGenre.find(
          (p) => p._id.toString() === products[i]._id.toString()
        );
        if (productWithGenre) {
            products[i] = productWithGenre;
        }
      }
//---------------------------------------------------------------------
      res.json({
        status: "success",
        result: products.length,
        products: products,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  createProduct: async (req, res) => {
    try {
      const {
        product_id,
        title,
        price,
        description,
        author,
        images,
        category,
        quantity,
      } = req.body;
      if (!images)
        return res
          .status(400)
          .json({ msg: "Никаких изображений не загружено" });

      const product = await Products.findOne({ product_id });
      if (product)
        return res.status(400).json({ msg: "Этот товар уже существует." });

      const categoryObj = await Category.findOne({ _id: category });
      if (!categoryObj) {
        return res.status(400).json({ msg: "Такой категории не существует." });
      }

      const newProduct = new Products({
        product_id,
        title: title.toLowerCase(),
        price,
        description,
        author,
        images,
        category,
        quantity,
      });

      await newProduct.save();
      res.json({ msg: "Товар создан" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deleteProduct: async (req, res) => {
    try {
      await Products.findByIdAndDelete(req.params.id);
      res.json({ msg: "Товар удален" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateProduct: async (req, res) => {
    try {
      const { title, price, description, author, images, category, quantity } =
        req.body;
      if (!images)
        return res.status(400).json({ msg: "Изображений не загружено" });

      await Products.findOneAndUpdate(
        { _id: req.params.id },
        {
          title: title.toLowerCase(),
          price,
          description,
          author,
          images,
          category,
          quantity,
        }
      );

      res.json({ msg: "Товар обнавлен" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = productCtrl;
