'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = required('mongoose');
const JobModel = required(./models/JobModel.js);
const authorize = require('./auth/authorize.js')
const PORT = process.env.PORT;
const MONGODB_URL = process.env.MONGODB_URL;

const app = express();
app.use(cors());
app.use(express.json());
app.use(authorize);

mongoose.connect(MONGODB_URL);

// READ
app.get('/jobs', async (request, response) => {
  try {
    let AllJobResponse = await JobModel.find({});
    response.json(AllJobResponse);
  } catch (error) {
    console.log('Something went wrong when finding jobs', error);
    response.status(500).send(error);
  }
});

//C