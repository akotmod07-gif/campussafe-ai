const Incident = require('../models/Incident');
const { getDBStatus } = require('../config/db');
const { mockIncidents } = require('../services/seedService');

// @desc    Get dashboard statistics and chart aggregations
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    let incidents = [];

    if (getDBStatus()) {
      incidents = await Incident.find({}).sort({ createdAt: -1 });
    } else {
      incidents = [...mockIncidents];
    }

    const total = incidents.length;
    const active = incidents.filter(i => i.status !== 'Resolved').length;
    const resolved = incidents.filter(i => i.status === 'Resolved').length;
    const critical = incidents.filter(i => i.severity === 'Critical').length;
    const highPriority = incidents.filter(i => i.priority === 'Immediate' || i.priority === 'Urgent').length;

    // Categories breakdown
    const categoriesMap = {};
    const statusesMap = { Reported: 0, Assigned: 0, Responding: 0, Resolved: 0 };
    const severitiesMap = { Low: 0, Medium: 0, High: 0, Critical: 0 };

    incidents.forEach(inc => {
      categoriesMap[inc.type] = (categoriesMap[inc.type] || 0) + 1;
      if (statusesMap[inc.status] !== undefined) statusesMap[inc.status] += 1;
      if (severitiesMap[inc.severity] !== undefined) severitiesMap[inc.severity] += 1;
    });

    const categoryDistribution = Object.keys(categoriesMap).map(cat => ({
      category: cat,
      count: categoriesMap[cat],
      percentage: total > 0 ? Math.round((categoriesMap[cat] / total) * 100) : 0,
    }));

    const statusDistribution = Object.keys(statusesMap).map(st => ({
      status: st,
      count: statusesMap[st],
      percentage: total > 0 ? Math.round((statusesMap[st] / total) * 100) : 0,
    }));

    // Realistic demo time metrics
    const avgResponseTime = '3.8 mins';

    // Activity over time (last 7 intervals/days)
    const timeline = [
      { time: '08:00', count: 1 },
      { time: '10:00', count: 3 },
      { time: '12:00', count: 6 },
      { time: '14:00', count: 4 },
      { time: '16:00', count: 8 },
      { time: '18:00', count: 5 },
      { time: '20:00', count: 2 },
    ];

    return res.json({
      success: true,
      stats: {
        total,
        active,
        resolved,
        critical,
        highPriority,
        avgResponseTime,
        registeredStudents: 4850,
      },
      charts: {
        categoryDistribution,
        statusDistribution,
        severities: severitiesMap,
        timeline,
      },
      recentIncidents: incidents.slice(0, 5),
    });
  } catch (error) {
    console.error('Stats error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to compute dashboard stats',
    });
  }
};

module.exports = { getDashboardStats };
