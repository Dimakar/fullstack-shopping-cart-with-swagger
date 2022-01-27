require('dotenv').config();

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const catalogRoutes = require('./routes/catalogRoutes');
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const swaggerUI = require("swagger-ui-express")
const swaggerJsDoc = require("swagger-jsdoc")

const publicPath = path.join(__dirname, '..', 'frontend', 'public');
const port = process.env.PORT || 5000;

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Library API",
      version: "1.0.0",
      description: "A simple Mobile Shop API",
    },
    servers: [
      {
        url: "http://localhost:5000",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const specs = swaggerJsDoc(options);

const app = express();

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

let connectionRetries = 0;

const connectWithRetry = () => {
  console.log('CONNECTING TO DB...');

  mongoose.connect(process.env.MONGODB_URI, {
    auth: { authSource: 'admin' },
    user: process.env.MONGODB_USER,
    pass: process.env.MONGODB_PASSWORD,
  }).then(() => {
    console.log('CONNECTED TO DB!');
    clearTimeout(connectWithRetry);
  }).catch((err) => {
    console.log(err);

    connectionRetries++;

    if (connectionRetries <= 4) {
      setTimeout(connectWithRetry, 5000);
    } else {
      clearTimeout(connectWithRetry);
    }
  });
};

connectWithRetry();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  bodyParser.json({
    limit: '10MB',
    type: 'application/json',
  }),
);
app.use(express.static(publicPath));

app.use('/api/auth', authRoutes);
app.use('/api/catalog', catalogRoutes);
app.use('/api/user', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/order', orderRoutes);

app.listen(port, () => console.log(`SERVER NOW RUNNING ON PORT ${port}...`));
