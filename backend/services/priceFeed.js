// services/priceFeed.js
const WebSocket = require('ws');

const socket = new WebSocket(`wss://ws.finnhub.io?token=${process.env.FINNHUB_API_KEY}`);

const symbols = [
  "EURUSD",
  "USDJPY",
  "GBPUSD",
  "AUDUSD",
  "USDCAD",
  "BINANCE:BTCUSDT",
  "BINANCE:ETHUSDT",
  "OANDA:XAUUSD",
  "BINANCE:SOLUSDT"
];

// Store latest prices
const latestPrices = {};

socket.on('open', () => {
  console.log('WebSocket connection opened to Finnhub');
  symbols.forEach(symbol => {
    socket.send(JSON.stringify({ type: 'subscribe', symbol }));
    console.log('Subscribed to:', symbol);
  });
});

socket.on('message', (data) => {
  // console.log('Raw WebSocket message:', data);
  try {
    const parsed = JSON.parse(data);
    if (parsed.type === 'trade' && parsed.data && parsed.data.length > 0) {
      parsed.data.forEach(trade => {
        const { s: symbol, p: price } = trade;
        latestPrices[symbol] = price;
      });
    }
  } catch (err) {
    console.error('priceFeed parse error', err);
  }
});

// Emit all prices every 1 second
setInterval(() => {
  if (global.io) {
    global.io.emit('stockPrices', latestPrices);
  }
}, 1000);

socket.on('error', (err) => console.error('Finnhub WS error:', err));
socket.on('close', () => console.log('WebSocket connection closed'));

module.exports = {
  socket,
  getLatestPrices: () => ({ ...latestPrices }), // return a shallow copy
};
