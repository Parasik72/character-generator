const express = require('express');
const Router = require('./routes');
const path= require('path');
const fileUpload = require('express-fileupload');

const app = express();

const STATIC_PATH = process.env.STATIC_PATH || 'static_path';

app.use(fileUpload());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, STATIC_PATH)));
app.use('/', Router);

module.exports = app;