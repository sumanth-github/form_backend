import { Router } from "express";
import { Product } from "../models/Product";

const router = Router();

// POST new product
router.post("/", async (req, res) => {
  try {
    const { name, category, description, questions, submitted } = req.body;

    const product = new Product({
      name,
      category,
      description,
      questions: questions || [], 
      submitted,
    });

    await product.save();
    res.json(product);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// GET all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// GET product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
