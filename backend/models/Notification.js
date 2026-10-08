const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: String, // email or user id
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  incidentId: {
    type: String,
    default: null,
  },
  type: {
    type: String,
    enum: ['info', 'warning', 'alert', 'success'],
    default: 'info',
  },
  read: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
