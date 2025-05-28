import { Request, Response } from "express";
import Product, { IProduct } from "../models/Product";

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, image } = req.body;

    const product = new Product({ name, description, price, image });
    const savedProduct = await product.save();

    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: "Failed to create product", error });
  }
};

export const createProducts = async (req: Request, res: Response) => {
  try {
    const products = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      res
        .status(400)
        .json({
          message: "Request body must be a non-empty array of products.",
        });
      return;
    }

    const insertedProducts = await Product.insertMany(products);

    res.status(201).json(insertedProducts);
  } catch (error) {
    res.status(500).json({ message: "Failed to insert products", error });
  }
};

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find({ isDeleted: false });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products", error });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch product", error });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, image } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, price, image },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) res.status(404).json({ message: "Product not found" });

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Failed to update product", error });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const deletedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true, runValidators: true }
    );

    if (!deletedProduct) res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete product", error });
  }
};
