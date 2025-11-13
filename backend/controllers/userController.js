// controllers/userController.js
const prisma = require('../config/db');

exports.getBalance = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { balance: true }
    });

    res.json({
      success: true,
      balance: Number(user.balance)
    });

  } catch (err) {
    console.error("getBalance error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
