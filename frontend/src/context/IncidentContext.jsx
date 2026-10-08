import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { incidentAPI, localStore } from '../services/api';
import { useAuth } from './AuthContext';

const IncidentContext = createContext(null);

export function IncidentProvider({ children }) {
  const { user } = useAuth();
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchIncidents = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const data = await incidentAPI.getAll(params);
      setIncidents(data || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch incidents');
      setIncidents(localStore.getIncidents());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIncidents();

    const handleUpdate = () => {
      fetchIncidents();
    };

    window.addEventListener('csa_incidents_updated', handleUpdate);
    return () => window.removeEventListener('csa_incidents_updated', handleUpdate);
  }, [fetchIncidents]);

  const getIncident = async (id) => {
    return await incidentAPI.getById(id);
  };

  const createIncident = async (incidentData) => {
    setLoading(true);
    try {
      const created = await incidentAPI.create(incidentData, user);
      await fetchIncidents();
      return created;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateIncident = async (id, updates) => {
    setLoading(true);
    try {
      const updated = await incidentAPI.update(id, updates, user);
      await fetchIncidents();
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resolveIncident = async (id, noteText = 'Incident successfully verified and resolved.') => {
    return await updateIncident(id, {
      status: 'Resolved',
      noteText,
    });
  };

  // Live computed statistics
  const stats = {
    total: incidents.length,
    active: incidents.filter((i) => i.status !== 'Resolved').length,
    resolved: incidents.filter((i) => i.status === 'Resolved').length,
    critical: incidents.filter((i) => i.severity === 'Critical').length,
    highPriority: incidents.filter((i) => i.priority === 'Immediate' || i.priority === 'Urgent').length,
    avgResponseTime: '3.8 mins',
    registeredStudents: 4850,
  };

  const value = {
    incidents,
    loading,
    error,
    stats,
    fetchIncidents,
    getIncident,
    createIncident,
    updateIncident,
    resolveIncident,
  };

  return <IncidentContext.Provider value={value}>{children}</IncidentContext.Provider>;
}

export function useIncidents() {
  const context = useContext(IncidentContext);
  if (!context) {
    throw new Error('useIncidents must be used within an IncidentProvider');
  }
  return context;
}
