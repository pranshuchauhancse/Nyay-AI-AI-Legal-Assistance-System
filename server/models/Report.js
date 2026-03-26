const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
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
    type: {
      type: String,
      enum: ['FIR', 'Investigation', 'System'],
      default: 'FIR',
    },
    status: {
      type: String,
      enum: ['Draft', 'Submitted', 'Reviewed'],
      default: 'Draft',
    },
    caseRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Case',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Report', reportSchema);
