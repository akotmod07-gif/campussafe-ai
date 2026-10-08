const express = require('express');
const router = express.Router();
const {
  createIncident,
  getIncidents,
  getIncidentById,
  updateIncident,
  deleteIncident,
  classifyText,
} = require('../controllers/incidentController');
const { protect, requireAdmin } = require('../middleware/authMiddleware');

router.post('/', protect, createIncident);
router.get('/', protect, getIncidents);
router.post('/classify', classifyText);
router.get('/:id', protect, getIncidentById);
router.put('/:id', protect, updateIncident);
router.delete('/:id', protect, requireAdmin, deleteIncident);

module.exports = router;
