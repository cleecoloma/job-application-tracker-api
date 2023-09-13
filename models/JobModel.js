'use strict';

const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
    required: false,
  },
});

const JobModel = mongoose.model('job', JobSchema);

module.exports = JobModel;
