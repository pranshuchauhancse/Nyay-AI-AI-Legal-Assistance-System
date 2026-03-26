const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['Filed', 'Under Investigation', 'In Hearing', 'Resolved', 'Closed'],
      default: 'Filed',
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    caseType: {
      type: String,
      trim: true,
    },
    hearingDate: {
      type: Date,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    judgment: {
      type: String,
      trim: true,
    },
    policeStatus: {
      type: String,
      trim: true,
    },
    documents: [
      {
        name: String,
        url: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    citizen: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    policeOfficer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    judge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    assignedLawyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    nextHearingDate: {
      type: Date,
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Case', caseSchema);
