export function formatDate(dateString) {
  if (!dateString) return 'Just now';
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hr${diffHours > 1 ? 's' : ''} ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (e) {
    return dateString;
  }
}

export function getSeverityBadge(severity) {
  switch (severity) {
    case 'Critical':
      return {
        bg: 'bg-red-50 text-red-700 border-red-200 ring-red-500/20',
        dot: 'bg-red-500',
        text: 'Critical',
      };
    case 'High':
      return {
        bg: 'bg-orange-50 text-orange-700 border-orange-200 ring-orange-500/20',
        dot: 'bg-orange-500',
        text: 'High',
      };
    case 'Medium':
      return {
        bg: 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20',
        dot: 'bg-amber-500',
        text: 'Medium',
      };
    case 'Low':
    default:
      return {
        bg: 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-500/20',
        dot: 'bg-blue-500',
        text: 'Low',
      };
  }
}

export function getStatusBadge(status) {
  switch (status) {
    case 'Reported':
      return {
        bg: 'bg-slate-100 text-slate-700 border-slate-200',
        dot: 'bg-slate-400',
        step: 0,
      };
    case 'Assigned':
      return {
        bg: 'bg-blue-50 text-blue-700 border-blue-200',
        dot: 'bg-blue-500',
        step: 1,
      };
    case 'Responding':
      return {
        bg: 'bg-purple-50 text-purple-700 border-purple-200 animate-pulse',
        dot: 'bg-purple-500',
        step: 2,
      };
    case 'Resolved':
      return {
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        dot: 'bg-emerald-500',
        step: 3,
      };
    default:
      return {
        bg: 'bg-slate-100 text-slate-600 border-slate-200',
        dot: 'bg-slate-400',
        step: 0,
      };
  }
}

export function getPriorityBadge(priority) {
  switch (priority) {
    case 'Immediate':
      return 'bg-red-600 text-white font-semibold';
    case 'Urgent':
      return 'bg-orange-500 text-white font-medium';
    case 'Normal':
      return 'bg-slate-700 text-white';
    case 'Low':
    default:
      return 'bg-slate-200 text-slate-800';
  }
}
