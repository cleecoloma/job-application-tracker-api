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
  postingLink: {
    type: String,
    required: true,
  },
  appliedStatus: {
    type: Boolean,
    required: false,
  },
  appliedDate: {
    type: String,
    required: false,
  },
  notes: {
    type: String,
    required: false,
  },
});

const JobModel = mongoose.model('job', JobSchema);

module.exports = JobModel;
