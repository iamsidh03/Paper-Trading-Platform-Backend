// index.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const prisma = require("./config/db"); // ✔ Correct Prisma client

dotenv.config();

const app = express();
const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Make io globally available for priceFeed
global.io = io;

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
});

// Middleware
app.use(cors());
app.use(express.json());

// ROUTES
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orders");
const stockRoutes = require("./routes/stockRoutes");
const userRoutes = require("./routes/userRoutes");
const priceRoutes = require("./routes/priceRoutes");
const tradeInfoRoutes = require("./routes/tradeInfoRoutes");
const holdingsRoutes = require("./routes/holdingRoutes"); 
const transactionsRoutes = require("./routes/transactionsRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/stocks", stockRoutes);
app.use("/api/user", userRoutes);
app.use("/api/prices", priceRoutes);
app.use("/api/trade", tradeInfoRoutes);
app.use("/api/holdings", holdingsRoutes);
app.use('/api/transactions', transactionsRoutes);

// Prisma DB connect + start price feed
(async () => {
  try {
    await prisma.$connect();
    console.log("Prisma connected to PostgreSQL successfully");

    // Start real-time price feed AFTER DB connect
    require("./services/priceFeed");

  } catch (err) {
    console.error("Prisma connection error:", err);
  }
})();

// Root route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Server start
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
