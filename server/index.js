const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(bodyParser.json());


app.listen(port, () => {
    console.log(`API listening on port ${port}!`);
});