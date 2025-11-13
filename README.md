
#  Paper Trading Platform – Backend

A full-featured **Zerodha-like Paper Trading Backend** built with **Node.js, Express, Prisma, PostgreSQL & Socket.IO**, supporting:

* Live Crypto Prices (WS)
* Live Forex Prices (WS)
* Stock Trading (DB price fallback)
* Buy/Sell Engine
* Holdings & Portfolio
* Real-Time P&L Calculation
* JWT Auth
* Prisma ORM
* Finnhub API Integration

---

##  Features

###  Authentication

* Signup / Login using JWT
* Password hashing using bcrypt
* Protected routes

###  Trading Engine

* Market Buy / Sell
* Live price execution (crypto + forex)
* Integer-only stock trading
* Crypto + Forex decimal trading
* Accurate average price calculation
* Balance deduction / refund
* Transaction history

###  Portfolio System

* Holdings table
* Real-time updated P&L
* Profit/Loss per asset
* Average buy price tracking

###  Live Price System

* Finnhub WebSocket
* Realtime: BTC, ETH, SOL, EURUSD, USDJPY, XAUUSD
* DB fallback price for stocks
* Unified price feed through REST + Socket.IO

###  Database – Prisma Schema

* User
* Stock
* Order
* Holding
* Transaction

---

##  Tech Stack

| Area             | Technology                   |
| ---------------- | ---------------------------- |
| Backend          | Node.js, Express             |
| Database         | PostgreSQL (Supabase)        |
| ORM              | Prisma                       |
| Real-time        | Socket.IO, Finnhub WebSocket |
| Auth             | JWT, bcrypt                  |
| Pricing          | WebSockets + REST            |
| Deployment-ready | Yes                          |

---

##  Installation & Setup

### 1️ Install dependencies

```
npm install
```

### 2️ Create `.env` file

```
PORT=5001
DATABASE_URL=your-postgres-url
JWT_SECRET=your-secret
JWT_EXPIRES_IN=1d
FINNHUB_API_KEY=your-finnhub-key
```

### 3️ Run Prisma migrations

```
npx prisma migrate dev
```

### 4️ Start server

```
npm run dev
```

---

##  API Endpoints

### **Auth**

| Method | Route            | Description       |
| ------ | ---------------- | ----------------- |
| POST   | /api/auth/signup | Register new user |
| POST   | /api/auth/login  | Login & get JWT   |

### **Orders (Trading Engine)**

| Method | Route       | Description                  |
| ------ | ----------- | ---------------------------- |
| POST   | /api/orders | Buy/Sell based on live price |

### **Portfolio**

| GET | /api/holdings | List user's holdings |
| GET | /api/transactions | Trade history |
| GET | /api/user/balance | Check balance |
| GET | /api/trade/pnl | Profit/Loss calculation |

### **Market Data**

| GET | /api/stocks | Stock list |
| GET | /api/prices/latest | Unified live price feed |

---

---

##  Project Structure

```
trader-backend/
│-- controllers/
│-- routes/
│-- services/
│-- middleware/
│-- prisma/
│-- config/
│-- index.js
│-- README.md
```

---

##  Architecture Flow (Simplified)

###  Live Prices

Finnhub WebSocket → priceFeed.js → latestPrices {} → Socket.IO → Frontend

###  Buy/Sell Order

Frontend → /api/orders
→ Validate
→ Fetch stock → get stock_id
→ Get live price or fallback
→ Update balance
→ Update holdings
→ Create order + transaction
→ Return executed order

###  Holdings / P&L

DB → Prisma → calculated using live + DB prices → returned as JSON




---

---

#  Full Documentation

## 1. Overview

This project is a **paper trading backend** simulating a real stock/crypto trading platform like Zerodha or Binance. It provides:

* Real-time crypto & forex prices
* Trading engine
* Holdings and P&L
* Authentication
* PostgreSQL database integration

---

## 2. Architecture Diagram (Text version)

```
Frontend
  |
  | REST + WebSocket
  v
Backend (Express)
  |
  +-- AuthController
  |      |
  |      ---> JWT Sign/Verify
  |
  +-- OrdersController
  |      |
  |      ---> Live Price Feed
  |      ---> Prisma (User, Holding, Order, Transaction)
  |
  +-- PriceFeed (Finnhub)
  |      |
  |      ---> WebSocket prices
  |      ---> Socket.IO emit
  |
  +-- Prisma ORM
         |
         ---> PostgreSQL (Supabase)
```

---

## 3. Database Schema Overview (Models)

* **User** – stores authentication + balance
* **Stock** – stores all tradeable assets
* **Order** – stores executed orders
* **Holding** – stores positions
* **Transaction** – trade history

---

## 4. Trading Engine Rules

### BUY:

* Check balance
* Deduct balance
* Update holdings
* Calculate new avg price
* Create order & transaction

### SELL:

* Check holdings
* Subtract quantity
* Add balance
* Create order & transaction

---

## 5. Live Price System

Finnhub → WebSocket → priceFeed.js → latestPrices → Express API → frontend

---

## 6. Security

* JWT-based auth
* Password hashing
* Protected routes
* Input validation

---



---

#  **3. HOW TO PUSH TO GITHUB (Full Commands)**

### 1️ Initialize Git

```
git init
```

### 2️ Add remote (replace with your repo URL)

```
git remote add origin https://github.com/YOUR_USERNAME/trading-backend.git
```

### 3️ Add all files

```
git add .
```

### 4️ Commit

```
git commit -m "Initial commit - Paper Trading Backend"
```

### 5️ Push

```
git branch -M main
git push -u origin main
```

---




### Project: **Paper Trading Platform – Backend**

* Built a Zerodha-like paper trading backend using **Node.js, Express & Prisma ORM**.
* Integrated **Finnhub WebSocket** for real-time crypto & forex price streaming.
* Designed a full **trading engine** (Buy/Sell) with average price, portfolio, and P&L calculations.
* Implemented JWT-based authentication and protected APIs.
* Managed user balance, holdings, and transaction history using PostgreSQL (Supabase).
* Used **Socket.IO** to broadcast live market data to frontend clients.
* Developed modular, production-ready backend architecture with clean routing, services, controllers, and middleware.

---



---

#  **“Challenges I Faced While Building My Trading Platform”**





---



## **1. The Finnhub “Why is my price not coming?” challenge**

“This one really confused me.
BTC and ETH started showing prices immediately, but when I added TSLA or GOOGL, the price never showed up.

I kept debugging priceFeed.js, checking WebSocket logs… nothing.”

### **How I solved it**

“Turns out FINNHUB NEVER SENDS LIVE STOCK PRICES in the free tier.
Only crypto, forex, gold etc.

Once I understood this difference:

* Crypto/forex use WebSocket
* Stocks use fallback price from DB

Then it clicked, and my `/prices/latest` API finally started making sense.”

---

## **2. The Decimal Quantity **

“This one was funny in hindsight.
At first, I used integers for quantity.
So when I tried to buy `0.001 BTC`, Prisma turned it into `0`.

Then I switched everything to decimals…
and suddenly you could buy **0.5 shares of Apple**, which is wrong.”

### **How I solved it**

“I redesigned the model with a simple rule:

* Stocks → allow only integers
* Crypto/Forex → allow decimals

This gave the system a real-world feel.”

---

## **3. Balancing + Holdings + Avg Price **

“When I executed a trade, 4 things had to update:

* Balance
* Holdings
* Average price
* Transactions

And if even one calculation was wrong, P&L became nonsense.”

### **How I solved it**

“I broke the logic step-by-step and tested each part individually.

I literally made small trades and calculated results manually to see if the backend matched my math.

After fixing avg price logic and ensuring the order of updates was correct, everything became consistent.”

---

## **4. Prisma Schema Sync Issues**

“There were moments where Prisma started shouting:

> ‘Column does not exist’
> ‘Column type mismatch’

Mostly because I updated schema but forgot to migrate.”

### **How I solved it**

“I disciplined myself:

* Any schema change → immediate migration
* Confirm in Prisma Studio
* Restart server

Once I followed this routine, these errors disappeared.”

---

## **5. The Live Price + DB Price Merge Issue**

“When `/api/prices/latest` returned only live crypto prices, I realized the frontend wouldn’t have prices for stocks.

So I needed a unified price feed.”

### **How I solved it**

“I merged:

* WebSocket prices
* DB stored prices

into one final map.

Now frontend gets everything in ONE API.”



---



“In short, this project taught me the difference between a simple CRUD app and a real-world system.

I learned how to:

* Structure a clean backend
* Handle live streaming data
* Work with decimals and money
* Maintain DB consistency
* Debug large multi-service systems
* Think like a real trading application developer

These challenges made the project much more exciting and helped me understand backend development at a deeper level.”

---



