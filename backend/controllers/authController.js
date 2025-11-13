// controllers/authController.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;
const DEFAULT_BALANCE = 100000; // demo balance

exports.signup = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        balance: DEFAULT_BALANCE, // initialize demo balance
      },
    });
    res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (err) {
    console.log("Signup error:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: "Invalid email" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // IMPORTANT: sign { id: user.id } so authMiddleware works
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1d' });

    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
