// app.js
const express = require('express');
const https = require('https');
require("dotenv").config();
const sequelize = require('./util/database');
const cors = require("cors");

const app = express();

const userRoutes = require("./routes/users");

app.use(express.json());
app.use(cors());
app.use('/users', userRoutes);

sequelize
  .sync()
  // .sync( { force : true } )
  .then(() => {
    app.listen(5000, () => {
      console.log("Server is running on port 5000");
    });
  })
  .catch((err) => {
    console.error("Error syncing with the database:", err);
  });
