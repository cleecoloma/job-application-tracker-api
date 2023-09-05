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

// CREATE
app.post('/jobs', async (request, response) => {
  try {
    let { company, location, title, postingLink, appliedStatus, appliedDate, notes } = request.body;
    if (!company || !location || !title || !postingLink) {
      response.status(400).send('Please send all required job object properties')
    } else {
      let newJob = new JobModel({ company, location, title, postingLink, appliedStatus, appliedDate, notes });
      let job = await newJob.save();
      response.json(job);
    }
  } catch (error) {
    response.status(400).send('Please send correct job object', error)
  }
})