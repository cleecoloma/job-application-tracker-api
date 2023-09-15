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
  const email = request.query.user;
  console.log(request.query);
  console.log(email);
  try {
    let allJobResponse = await JobModel.find({ user: email});
    response.json(allJobResponse);
  } catch (error) {
    response.status(500).send('Something went wrong when finding jobs', error);
  }
});

// CREATE
app.post('/jobs', async (request, response) => {
  try {
    let { user, company, location, title, link, status, notes } = request.body;
    if (!user || !company || !location || !title) {
      response.status(400).send('Please send all required job object properties')
    } else {
      const currentDate = new Date();
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      const addedDate = currentDate.toLocaleDateString(undefined, options);
      let newJob = new JobModel({ user, company, location, title, addedDate, link, status, notes });
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
      let result = await JobModel.findByIdAndDelete(request.params.jobId);
      response.status(204).send('Success');
    };
  } catch (error) {
    response.status(500).send('Internal Server Error')
  }
})

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));