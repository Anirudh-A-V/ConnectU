const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const dotenv = require('dotenv');
dotenv.config();

const routes = require('./routes/routes.js');

const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(bodyParser.json());

app.use('/', routes);

const uri = process.env.MONGODB_CONNECTION_URL;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

app.listen(port, () => {
    console.log(`API listening on port ${port}!`);
});