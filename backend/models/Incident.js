const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
  incidentId: {
    type: String,
    required: true,
    unique: true,
  },
  reporter: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: '' },
    studentId: { type: String, default: 'STU-8821' },
  },
  type: {
    type: String,
    required: true,
    enum: ['Medical', 'Fire', 'Accident', 'Harassment', 'Theft', 'Unsafe Area', 'Other'],
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: null,
  },
  severity: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium',
  },
  priority: {
    type: String,
    enum: ['Low', 'Normal', 'Urgent', 'Immediate'],
    default: 'Normal',
  },
  status: {
    type: String,
    enum: ['Reported', 'Assigned', 'Responding', 'Resolved'],
    default: 'Reported',
  },
  assignedResponder: {
    type: String,
    default: 'Unassigned',
  },
  responseNotes: [
    {
      note: { type: String, required: true },
      author: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ],
  aiAnalysis: {
    suggestedCategory: String,
    suggestedSeverity: String,
    suggestedPriority: String,
    confidence: Number,
    keywordsDetected: [String],
    accepted: { type: Boolean, default: true },
  },
  isSOS: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  resolvedAt: {
    type: Date,
    default: null,
  },
});

module.exports = mongoose.models.Incident || mongoose.model('Incident', incidentSchema);
