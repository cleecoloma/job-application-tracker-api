'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); 
const JobModel = require('./models/JobModel.js');
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
    let allJobResponse = await JobModel.find({});
    response.json(allJobResponse);
  } catch (error) {
    console.log('Something went wrong when finding jobs', error);
    response.status(500).send(error);
  }
});

// CREATE
app.post('/jobs', async (request, response) => {
  console.log(`Hello - Im at the server now`, request.body);
  try {
    let { company, location, title, link, status, notes } = request.body;
    if (!company || !location || !title) {
      response.status(400).send('Please send all required job object properties')
    } else {
      let newJob = new JobModel({ company, location, title, link, status, notes });
      let job = await newJob.save();
      response.json(job);
    }
  } catch (error) {
    response.status(500).send('Please send correct job object', error)
  }
})

// UPDATE
app.put('/jobs/:jobId', async (request, response) => {
  let id = request.params.jobId;
  try {
    await JobModel.replaceOne({ _id: id }, request.body);
    let newJob = await JobModel.findOne({ _id: id });
    response.status(200).json(newJob);
  } catch (error) {
    response.status(500).send(`Please send correct job object`, error)
  }
})

// DELETE
app.delete('/jobs/:jobId', async (request, response) => {
  try {
    if (!request.params.jobId) {
    request.status(404).send('Please provide valid job ID');
    } else {
      console.log('Deleting job at ID: ' + request.params.jobId);
      let result = await JobModel.findByIdAndDelete(request.params.jobId);
      console.log(result);
      response.status(204).send('Success');
    };
  } catch (error) {
    response.status(500).send('Internal Server Error')
  }
})

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));