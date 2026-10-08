const Notification = require('../models/Notification');
const { getDBStatus } = require('../config/db');
const { mockNotifications } = require('../services/seedService');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res) => {
  try {
    const userEmail = req.user ? req.user.email : 'student@campus.com';
    const role = req.user ? req.user.role : 'student';

    if (getDBStatus()) {
      const query = role === 'admin'
        ? { $or: [{ user: userEmail }, { user: 'admin@campus.com' }] }
        : { user: userEmail };

      const notifications = await Notification.find(query).sort({ createdAt: -1 });

      return res.json({
        success: true,
        count: notifications.length,
        unreadCount: notifications.filter(n => !n.read).length,
        data: notifications,
      });
    } else {
      // In-Memory
      const filtered = mockNotifications.filter(n => {
        if (role === 'admin') return true;
        return n.user.toLowerCase() === userEmail.toLowerCase();
      });

      return res.json({
        success: true,
        count: filtered.length,
        unreadCount: filtered.filter(n => !n.read).length,
        data: filtered,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve notifications',
    });
  }
};

// @desc    Mark single notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    if (getDBStatus()) {
      await Notification.findByIdAndUpdate(id, { read: true });
      return res.json({ success: true, message: 'Notification marked as read' });
    } else {
      const notif = mockNotifications.find(n => n._id === id || n.id === id);
      if (notif) notif.read = true;
      return res.json({ success: true, message: 'Notification marked as read (In-Memory)' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Update failed' });
  }
};

// @desc    Mark all user notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
const markAllAsRead = async (req, res) => {
  try {
    const userEmail = req.user ? req.user.email : 'student@campus.com';
    const role = req.user ? req.user.role : 'student';

    if (getDBStatus()) {
      const query = role === 'admin'
        ? { $or: [{ user: userEmail }, { user: 'admin@campus.com' }] }
        : { user: userEmail };

      await Notification.updateMany(query, { read: true });
      return res.json({ success: true, message: 'All notifications marked as read' });
    } else {
      mockNotifications.forEach(n => {
        if (role === 'admin' || n.user.toLowerCase() === userEmail.toLowerCase()) {
          n.read = true;
        }
      });
      return res.json({ success: true, message: 'All notifications marked as read (In-Memory)' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to mark notifications' });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
};
