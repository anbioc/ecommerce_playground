const express = require('express');
const dotenv = require("dotenv");
const mongoose = require('mongoose');

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended : true}));

dotenv.config();
const PORT = process.env.PORT || 6000;
const DB_URL = process.env.DB_URL;

mongoose.set("strictQuery", false);

exports.expressApp = app;
exports.mongoose = mongoose;
exports.PORT = PORT;
exports.DB_URL = DB_URL;
