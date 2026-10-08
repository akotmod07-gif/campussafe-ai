const Incident = require('../models/Incident');
const Notification = require('../models/Notification');
const { getDBStatus } = require('../config/db');
const { mockIncidents, mockNotifications } = require('../services/seedService');
const { generateIncidentId } = require('../utils/generateId');
const { classifyIncident } = require('../services/aiClassifierService');

// @desc    Create new incident report
// @route   POST /api/incidents
// @access  Private
const createIncident = async (req, res) => {
  try {
    const {
      type,
      title,
      description,
      location,
      severity,
      priority,
      image,
      isSOS,
      contactPhone,
      aiAnalysis,
    } = req.body;

    if (!description || !location) {
      return res.status(400).json({
        success: false,
        message: 'Incident description and location are required',
      });
    }

    // Auto classify if not provided or to reinforce
    const aiResult = aiAnalysis || classifyIncident(description);
    const incidentId = generateIncidentId();

    const incidentData = {
      incidentId,
      reporter: {
        name: req.user ? req.user.name : 'Campus Student',
        email: req.user ? req.user.email : 'student@campus.com',
        phone: contactPhone || (req.user ? req.user.phone : ''),
        studentId: req.user ? (req.user.studentId || 'STU-8821') : 'STU-8821',
      },
      type: type || aiResult.category || 'Other',
      title: title || `${type || aiResult.category} Incident at ${location}`,
      description,
      location,
      image: image || null,
      severity: severity || aiResult.severity || 'Medium',
      priority: priority || aiResult.priority || 'Normal',
      status: 'Reported',
      assignedResponder: 'Unassigned',
      responseNotes: [],
      aiAnalysis: {
        suggestedCategory: aiResult.category || aiResult.suggestedCategory,
        suggestedSeverity: aiResult.severity || aiResult.suggestedSeverity,
        suggestedPriority: aiResult.priority || aiResult.suggestedPriority,
        confidence: aiResult.confidence || 0.95,
        keywordsDetected: aiResult.matchedKeywords || aiResult.keywordsDetected || [],
        accepted: true,
      },
      isSOS: Boolean(isSOS),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      resolvedAt: null,
    };

    if (getDBStatus()) {
      const incident = await Incident.create(incidentData);

      // Create Admin Notification
      await Notification.create({
        user: 'admin@campus.com',
        title: isSOS ? 'EMERGENCY SOS DISPATCH' : `New Incident Reported: ${incident.incidentId}`,
        message: `${incident.type} emergency at ${incident.location} with ${incident.severity} severity.`,
        incidentId: incident.incidentId,
        type: incident.severity === 'Critical' ? 'alert' : 'info',
      });

      return res.status(201).json({
        success: true,
        message: 'Emergency incident report created successfully',
        data: incident,
      });
    } else {
      // In-Memory Mode
      const newIncident = {
        _id: 'inc_' + Date.now(),
        ...incidentData,
      };

      mockIncidents.unshift(newIncident);

      // Push notification for Admin
      mockNotifications.unshift({
        _id: 'notif_' + Date.now(),
        user: 'admin@campus.com',
        title: isSOS ? 'EMERGENCY SOS DISPATCH' : `New Incident Reported: ${newIncident.incidentId}`,
        message: `${newIncident.type} emergency at ${newIncident.location} with ${newIncident.severity} severity.`,
        incidentId: newIncident.incidentId,
        type: newIncident.severity === 'Critical' ? 'alert' : 'info',
        read: false,
        createdAt: new Date().toISOString(),
      });

      return res.status(201).json({
        success: true,
        message: 'Emergency report created successfully (In-Memory Demo)',
        data: newIncident,
      });
    }
  } catch (error) {
    console.error('Create incident error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while submitting incident report',
    });
  }
};

// @desc    Get all incidents (with query filters)
// @route   GET /api/incidents
// @access  Private
const getIncidents = async (req, res) => {
  try {
    const { category, severity, priority, status, search, reporterOnly } = req.query;

    if (getDBStatus()) {
      const query = {};

      if (category && category !== 'All') query.type = category;
      if (severity && severity !== 'All') query.severity = severity;
      if (priority && priority !== 'All') query.priority = priority;
      if (status && status !== 'All') query.status = status;
      if (reporterOnly === 'true' && req.user) {
        query['reporter.email'] = req.user.email;
      }

      if (search) {
        query.$or = [
          { incidentId: { $regex: search, $options: 'i' } },
          { title: { $regex: search, $options: 'i' } },
          { location: { $regex: search, $options: 'i' } },
          { 'reporter.name': { $regex: search, $options: 'i' } },
        ];
      }

      const incidents = await Incident.find(query).sort({ createdAt: -1 });

      return res.json({
        success: true,
        count: incidents.length,
        data: incidents,
      });
    } else {
      // In-Memory Mode
      let results = [...mockIncidents];

      if (reporterOnly === 'true' && req.user && req.user.role === 'student') {
        results = results.filter(inc => inc.reporter && inc.reporter.email.toLowerCase() === req.user.email.toLowerCase());
      }

      if (category && category !== 'All') {
        results = results.filter(inc => inc.type === category);
      }
      if (severity && severity !== 'All') {
        results = results.filter(inc => inc.severity === severity);
      }
      if (priority && priority !== 'All') {
        results = results.filter(inc => inc.priority === priority);
      }
      if (status && status !== 'All') {
        results = results.filter(inc => inc.status === status);
      }

      if (search) {
        const s = search.toLowerCase();
        results = results.filter(inc =>
          inc.incidentId.toLowerCase().includes(s) ||
          inc.title.toLowerCase().includes(s) ||
          inc.location.toLowerCase().includes(s) ||
          (inc.reporter && inc.reporter.name.toLowerCase().includes(s))
        );
      }

      results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      return res.json({
        success: true,
        count: results.length,
        data: results,
      });
    }
  } catch (error) {
    console.error('Get incidents error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve incidents',
    });
  }
};

// @desc    Get incident by ID or incidentId
// @route   GET /api/incidents/:id
// @access  Private
const getIncidentById = async (req, res) => {
  try {
    const { id } = req.params;

    if (getDBStatus()) {
      let incident;
      if (id.startsWith('CSA-')) {
        incident = await Incident.findOne({ incidentId: id });
      } else {
        incident = await Incident.findById(id);
      }

      if (!incident) {
        return res.status(404).json({
          success: false,
          message: 'Incident not found',
        });
      }

      return res.json({
        success: true,
        data: incident,
      });
    } else {
      // In-Memory
      const incident = mockIncidents.find(inc => inc.incidentId === id || inc._id === id || inc.id === id);
      if (!incident) {
        return res.status(404).json({
          success: false,
          message: 'Incident not found',
        });
      }

      return res.json({
        success: true,
        data: incident,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to load incident details',
    });
  }
};

// @desc    Update incident (responder, status, notes, severity, priority)
// @route   PUT /api/incidents/:id
// @access  Private (Admin or Reporter)
const updateIncident = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, assignedResponder, responseNotes, severity, priority, noteText } = req.body;

    const updateFields = {
      updatedAt: new Date().toISOString(),
    };

    if (status) updateFields.status = status;
    if (assignedResponder) updateFields.assignedResponder = assignedResponder;
    if (severity) updateFields.severity = severity;
    if (priority) updateFields.priority = priority;

    if (status === 'Resolved') {
      updateFields.resolvedAt = new Date().toISOString();
    }

    if (getDBStatus()) {
      let incident = await Incident.findOne({
        $or: [{ incidentId: id }, { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }],
      });

      if (!incident) {
        return res.status(404).json({ success: false, message: 'Incident not found' });
      }

      if (noteText) {
        incident.responseNotes.push({
          note: noteText,
          author: req.user ? req.user.name : 'Campus Administrator',
          timestamp: new Date(),
        });
      }

      Object.assign(incident, updateFields);
      await incident.save();

      // Trigger student notification
      if (status || assignedResponder) {
        await Notification.create({
          user: incident.reporter.email,
          title: `Update on ${incident.incidentId}`,
          message: status === 'Resolved'
            ? `Your incident ${incident.incidentId} has been resolved.`
            : `Status changed to '${incident.status}'. Assigned responder: ${incident.assignedResponder}.`,
          incidentId: incident.incidentId,
          type: status === 'Resolved' ? 'success' : 'info',
        });
      }

      return res.json({
        success: true,
        message: 'Incident updated successfully',
        data: incident,
      });
    } else {
      // In-Memory
      const incident = mockIncidents.find(inc => inc.incidentId === id || inc._id === id || inc.id === id);
      if (!incident) {
        return res.status(404).json({ success: false, message: 'Incident not found' });
      }

      if (noteText) {
        incident.responseNotes = incident.responseNotes || [];
        incident.responseNotes.push({
          note: noteText,
          author: req.user ? req.user.name : 'Campus Administrator',
          timestamp: new Date().toISOString(),
        });
      }

      Object.assign(incident, updateFields);

      // Create notification for student reporter
      if (incident.reporter && incident.reporter.email) {
        mockNotifications.unshift({
          _id: 'notif_' + Date.now(),
          user: incident.reporter.email,
          title: `Update on ${incident.incidentId}`,
          message: status === 'Resolved'
            ? `Your incident ${incident.incidentId} has been resolved.`
            : `Status changed to '${incident.status}'. Assigned responder: ${incident.assignedResponder}.`,
          incidentId: incident.incidentId,
          type: status === 'Resolved' ? 'success' : 'info',
          read: false,
          createdAt: new Date().toISOString(),
        });
      }

      return res.json({
        success: true,
        message: 'Incident updated successfully (In-Memory Demo)',
        data: incident,
      });
    }
  } catch (error) {
    console.error('Update incident error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update incident',
    });
  }
};

// @desc    Delete incident
// @route   DELETE /api/incidents/:id
// @access  Private (Admin)
const deleteIncident = async (req, res) => {
  try {
    const { id } = req.params;

    if (getDBStatus()) {
      await Incident.findOneAndDelete({ $or: [{ incidentId: id }, { _id: id }] });
      return res.json({ success: true, message: 'Incident deleted successfully' });
    } else {
      const idx = mockIncidents.findIndex(inc => inc.incidentId === id || inc._id === id);
      if (idx !== -1) {
        mockIncidents.splice(idx, 1);
      }
      return res.json({ success: true, message: 'Incident deleted successfully (In-Memory Demo)' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete incident' });
  }
};

// @desc    Classify description using AI rule engine
// @route   POST /api/incidents/classify
// @access  Public
const classifyText = async (req, res) => {
  try {
    const { text } = req.body;
    const result = classifyIncident(text);
    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Classification failed',
    });
  }
};

module.exports = {
  createIncident,
  getIncidents,
  getIncidentById,
  updateIncident,
  deleteIncident,
  classifyText,
};
