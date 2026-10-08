import axios from 'axios';
import { INITIAL_USERS, INITIAL_INCIDENTS, INITIAL_NOTIFICATIONS } from '../data/demoData';
import { classifyEmergencyText } from './aiClassifier';
import { generateIncidentId } from '../utils/idGenerator';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create Axios client
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 4000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Authorization header if JWT token exists
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('csa_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Initialize localStorage with initial demo datasets if empty
export function initLocalData() {
  if (!localStorage.getItem('csa_incidents')) {
    localStorage.setItem('csa_incidents', JSON.stringify(INITIAL_INCIDENTS));
  }
  if (!localStorage.getItem('csa_notifications')) {
    localStorage.setItem('csa_notifications', JSON.stringify(INITIAL_NOTIFICATIONS));
  }
  if (!localStorage.getItem('csa_users')) {
    localStorage.setItem('csa_users', JSON.stringify(INITIAL_USERS));
  }
}

// LocalStorage helpers
export const localStore = {
  getIncidents() {
    initLocalData();
    try {
      return JSON.parse(localStorage.getItem('csa_incidents')) || INITIAL_INCIDENTS;
    } catch {
      return INITIAL_INCIDENTS;
    }
  },
  saveIncidents(incidents) {
    localStorage.setItem('csa_incidents', JSON.stringify(incidents));
    window.dispatchEvent(new Event('csa_incidents_updated'));
  },
  getNotifications() {
    initLocalData();
    try {
      return JSON.parse(localStorage.getItem('csa_notifications')) || INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  },
  saveNotifications(notifs) {
    localStorage.setItem('csa_notifications', JSON.stringify(notifs));
    window.dispatchEvent(new Event('csa_notifications_updated'));
  },
  getUsers() {
    initLocalData();
    try {
      return JSON.parse(localStorage.getItem('csa_users')) || INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  },
  saveUsers(users) {
    localStorage.setItem('csa_users', JSON.stringify(users));
  },
  resetToDefault() {
    localStorage.setItem('csa_incidents', JSON.stringify(INITIAL_INCIDENTS));
    localStorage.setItem('csa_notifications', JSON.stringify(INITIAL_NOTIFICATIONS));
    localStorage.setItem('csa_users', JSON.stringify(INITIAL_USERS));
    window.dispatchEvent(new Event('csa_incidents_updated'));
    window.dispatchEvent(new Event('csa_notifications_updated'));
  }
};

// Check backend connectivity
export async function checkBackendHealth() {
  try {
    const res = await apiClient.get('/health', { timeout: 2000 });
    return { online: true, mode: res.data.mode || 'Online' };
  } catch (err) {
    return { online: false, mode: 'Local Demo Fallback' };
  }
}

// ================= AUTH API =================
export const authAPI = {
  async login(email, password) {
    try {
      const res = await apiClient.post('/auth/login', { email, password });
      return res.data;
    } catch (error) {
      // Graceful local fallback for demo credentials
      const cleanEmail = email.toLowerCase().trim();
      const users = localStore.getUsers();
      const user = users.find(u => u.email.toLowerCase() === cleanEmail);

      if (user) {
        const dummyToken = `demo_jwt_${user.role}_${Date.now()}`;
        return {
          success: true,
          token: dummyToken,
          user,
          isLocalFallback: true,
        };
      }
      throw new Error(error.response?.data?.message || 'Invalid credentials');
    }
  },

  async register(userData) {
    try {
      const res = await apiClient.post('/auth/register', userData);
      return res.data;
    } catch (error) {
      // Local fallback
      const users = localStore.getUsers();
      const cleanEmail = userData.email.toLowerCase().trim();
      if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
        throw new Error('Email already registered');
      }

      const newUser = {
        id: 'usr_' + Date.now(),
        name: userData.name,
        email: cleanEmail,
        role: userData.role || 'student',
        phone: userData.phone || '',
        department: userData.department || 'General',
        studentId: userData.studentId || `STU-${Math.floor(1000 + Math.random() * 9000)}`,
      };

      users.push(newUser);
      localStore.saveUsers(users);

      const dummyToken = `demo_jwt_${newUser.role}_${Date.now()}`;
      return {
        success: true,
        token: dummyToken,
        user: newUser,
        isLocalFallback: true,
      };
    }
  },

  async getMe() {
    try {
      const res = await apiClient.get('/auth/me');
      return res.data;
    } catch (error) {
      const savedUser = localStorage.getItem('csa_user');
      if (savedUser) {
        return { success: true, user: JSON.parse(savedUser) };
      }
      throw error;
    }
  },
};

// ================= INCIDENTS API =================
export const incidentAPI = {
  async getAll(params = {}) {
    try {
      const res = await apiClient.get('/incidents', { params });
      return res.data.data;
    } catch (error) {
      // Local fallback
      let incidents = localStore.getIncidents();

      if (params.reporterOnly && params.userEmail) {
        incidents = incidents.filter(i => i.reporter?.email?.toLowerCase() === params.userEmail.toLowerCase());
      }
      if (params.category && params.category !== 'All') {
        incidents = incidents.filter(i => i.type === params.category);
      }
      if (params.severity && params.severity !== 'All') {
        incidents = incidents.filter(i => i.severity === params.severity);
      }
      if (params.priority && params.priority !== 'All') {
        incidents = incidents.filter(i => i.priority === params.priority);
      }
      if (params.status && params.status !== 'All') {
        incidents = incidents.filter(i => i.status === params.status);
      }
      if (params.search) {
        const s = params.search.toLowerCase();
        incidents = incidents.filter(i =>
          i.incidentId.toLowerCase().includes(s) ||
          i.title.toLowerCase().includes(s) ||
          i.location.toLowerCase().includes(s) ||
          (i.reporter?.name && i.reporter.name.toLowerCase().includes(s))
        );
      }

      return incidents;
    }
  },

  async getById(id) {
    try {
      const res = await apiClient.get(`/incidents/${id}`);
      return res.data.data;
    } catch (error) {
      const incidents = localStore.getIncidents();
      const found = incidents.find(i => i.incidentId === id || i.id === id || i._id === id);
      if (!found) throw new Error('Incident not found');
      return found;
    }
  },

  async create(data, currentUser) {
    try {
      const res = await apiClient.post('/incidents', data);
      // Sync local state as well
      const created = res.data.data;
      const incidents = localStore.getIncidents();
      localStore.saveIncidents([created, ...incidents]);
      return created;
    } catch (error) {
      // Local fallback creation
      const aiResult = data.aiAnalysis || classifyEmergencyText(data.description);
      const incidentId = generateIncidentId();

      const newIncident = {
        id: 'inc_' + Date.now(),
        incidentId,
        reporter: {
          name: currentUser?.name || 'Campus Student',
          email: currentUser?.email || 'student@campus.com',
          phone: data.contactPhone || currentUser?.phone || '+1 (555) 234-5678',
          studentId: currentUser?.studentId || 'STU-8821',
        },
        type: data.type || aiResult?.category || 'Other',
        title: data.title || `${data.type || aiResult?.category} Incident at ${data.location}`,
        description: data.description,
        location: data.location,
        image: data.image || null,
        severity: data.severity || aiResult?.severity || 'Medium',
        priority: data.priority || aiResult?.priority || 'Normal',
        status: 'Reported',
        assignedResponder: 'Unassigned',
        responseNotes: [],
        aiAnalysis: aiResult,
        isSOS: Boolean(data.isSOS),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        resolvedAt: null,
      };

      const incidents = localStore.getIncidents();
      localStore.saveIncidents([newIncident, ...incidents]);

      // Admin notification
      const notifs = localStore.getNotifications();
      const adminNotif = {
        id: 'notif_' + Date.now(),
        user: 'admin@campus.com',
        title: data.isSOS ? 'EMERGENCY SOS ALERT' : `New Incident: ${incidentId}`,
        message: `${newIncident.type} reported at ${newIncident.location} (${newIncident.severity}).`,
        incidentId,
        type: newIncident.severity === 'Critical' ? 'alert' : 'info',
        read: false,
        createdAt: new Date().toISOString(),
      };
      localStore.saveNotifications([adminNotif, ...notifs]);

      return newIncident;
    }
  },

  async update(id, updates, currentUser) {
    try {
      const res = await apiClient.put(`/incidents/${id}`, updates);
      // Sync to local
      const incidents = localStore.getIncidents();
      const updatedList = incidents.map(inc =>
        inc.incidentId === id || inc.id === id ? { ...inc, ...res.data.data } : inc
      );
      localStore.saveIncidents(updatedList);
      return res.data.data;
    } catch (error) {
      // Local fallback
      const incidents = localStore.getIncidents();
      const index = incidents.findIndex(i => i.incidentId === id || i.id === id);

      if (index === -1) throw new Error('Incident not found');

      const target = { ...incidents[index] };

      if (updates.status) target.status = updates.status;
      if (updates.assignedResponder) target.assignedResponder = updates.assignedResponder;
      if (updates.severity) target.severity = updates.severity;
      if (updates.priority) target.priority = updates.priority;
      if (updates.status === 'Resolved') target.resolvedAt = new Date().toISOString();
      target.updatedAt = new Date().toISOString();

      if (updates.noteText) {
        target.responseNotes = target.responseNotes || [];
        target.responseNotes.push({
          note: updates.noteText,
          author: currentUser?.name || 'Administrator',
          timestamp: new Date().toISOString(),
        });
      }

      incidents[index] = target;
      localStore.saveIncidents(incidents);

      // Student notification
      if (target.reporter?.email) {
        const notifs = localStore.getNotifications();
        const studentNotif = {
          id: 'notif_' + Date.now(),
          user: target.reporter.email,
          title: `Update on ${target.incidentId}`,
          message: updates.status === 'Resolved'
            ? `Your incident ${target.incidentId} has been resolved.`
            : `Status changed to '${target.status}'. Responder: ${target.assignedResponder}.`,
          incidentId: target.incidentId,
          type: updates.status === 'Resolved' ? 'success' : 'info',
          read: false,
          createdAt: new Date().toISOString(),
        };
        localStore.saveNotifications([studentNotif, ...notifs]);
      }

      return target;
    }
  },

  async classify(text) {
    try {
      const res = await apiClient.post('/incidents/classify', { text });
      return res.data.data;
    } catch {
      return classifyEmergencyText(text);
    }
  },
};

// ================= NOTIFICATIONS API =================
export const notificationAPI = {
  async getAll(userEmail, role) {
    try {
      const res = await apiClient.get('/notifications');
      return res.data.data;
    } catch (error) {
      const notifs = localStore.getNotifications();
      return notifs.filter(n => {
        if (role === 'admin') return true;
        return n.user?.toLowerCase() === userEmail?.toLowerCase();
      });
    }
  },

  async markAsRead(id) {
    try {
      await apiClient.put(`/notifications/${id}/read`);
    } catch {
      // Local fallback
    }
    const notifs = localStore.getNotifications();
    const updated = notifs.map(n => (n.id === id || n._id === id ? { ...n, read: true } : n));
    localStore.saveNotifications(updated);
  },

  async markAllAsRead(userEmail, role) {
    try {
      await apiClient.put('/notifications/read-all');
    } catch {
      // Local fallback
    }
    const notifs = localStore.getNotifications();
    const updated = notifs.map(n => {
      if (role === 'admin' || n.user?.toLowerCase() === userEmail?.toLowerCase()) {
        return { ...n, read: true };
      }
      return n;
    });
    localStore.saveNotifications(updated);
  },
};

// ================= DASHBOARD STATS API =================
export const dashboardAPI = {
  async getStats() {
    try {
      const res = await apiClient.get('/dashboard/stats');
      return res.data;
    } catch (error) {
      // Local fallback computation
      const incidents = localStore.getIncidents();
      const total = incidents.length;
      const active = incidents.filter(i => i.status !== 'Resolved').length;
      const resolved = incidents.filter(i => i.status === 'Resolved').length;
      const critical = incidents.filter(i => i.severity === 'Critical').length;
      const highPriority = incidents.filter(i => i.priority === 'Immediate' || i.priority === 'Urgent').length;

      const catMap = {};
      const statusMap = { Reported: 0, Assigned: 0, Responding: 0, Resolved: 0 };

      incidents.forEach(inc => {
        catMap[inc.type] = (catMap[inc.type] || 0) + 1;
        if (statusMap[inc.status] !== undefined) statusMap[inc.status] += 1;
      });

      return {
        stats: {
          total,
          active,
          resolved,
          critical,
          highPriority,
          avgResponseTime: '3.8 mins',
          registeredStudents: 4850,
        },
        charts: {
          categoryDistribution: Object.keys(catMap).map(c => ({
            category: c,
            count: catMap[c],
            percentage: total ? Math.round((catMap[c] / total) * 100) : 0,
          })),
          statusDistribution: Object.keys(statusMap).map(s => ({
            status: s,
            count: statusMap[s],
            percentage: total ? Math.round((statusMap[s] / total) * 100) : 0,
          })),
          timeline: [
            { time: '08:00', count: 1 },
            { time: '10:00', count: 3 },
            { time: '12:00', count: 6 },
            { time: '14:00', count: 4 },
            { time: '16:00', count: 8 },
            { time: '18:00', count: 5 },
            { time: '20:00', count: 2 },
          ],
        },
        recentIncidents: incidents.slice(0, 5),
      };
    }
  },
};
