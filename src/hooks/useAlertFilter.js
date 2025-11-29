import { useState, useMemo } from 'react';

export const useAlertFilter = (alerts) => {
  const [filters, setFilters] = useState({});

  const filteredAlerts = useMemo(() => {
    return alerts.filter(alert => {
      if (filters.type && alert.type !== filters.type) return false;
      if (filters.sourceType && alert.sourceType !== filters.sourceType) return false;
      if (filters.sourceId && alert.sourceId !== filters.sourceId) return false;
      if (filters.severity && alert.severity !== filters.severity) return false;
      if (filters.resolved !== undefined && alert.resolved !== filters.resolved) return false;
      if (filters.dateFrom && alert.timestamp < filters.dateFrom) return false;
      if (filters.dateTo && alert.timestamp > filters.dateTo) return false;
      return true;
    });
  }, [alerts, filters]);

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  return { filteredAlerts, filters, updateFilter, clearFilters };
};
