import React from 'react';
import { Bell, CheckCheck, Clock, AlertTriangle, Info, CheckCircle2, X } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { formatDate } from '../utils/formatters';
import { useNavigate } from 'react-router-dom';

export default function NotificationDropdown({ isOpen, onClose }) {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleNotificationClick = (notif) => {
    markAsRead(notif.id || notif._id);
    if (notif.incidentId) {
      navigate(`/incidents/${notif.incidentId}`);
      onClose();
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'alert':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-96 max-w-[90vw] bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
      {/* Header */}
      <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-blue-400" />
          <h3 className="font-semibold text-sm">Notifications</h3>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 text-xs font-bold bg-red-500 text-white rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-xs text-blue-300 hover:text-white flex items-center gap-1 transition"
              title="Mark all as read"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Mark all
            </button>
          )}
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="max-h-96 overflow-y-auto divide-y divide-slate-100">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">
            <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="font-medium text-slate-600">No notifications yet</p>
            <p className="text-xs text-slate-400 mt-1">Updates on your reports will appear here</p>
          </div>
        ) : (
          notifications.map((notif) => {
            const isUnread = !notif.read;
            return (
              <div
                key={notif.id || notif._id}
                onClick={() => handleNotificationClick(notif)}
                className={`p-3.5 hover:bg-slate-50 cursor-pointer transition flex items-start gap-3 ${
                  isUnread ? 'bg-blue-50/40' : ''
                }`}
              >
                <div className="mt-0.5 p-1.5 rounded-lg bg-slate-100 flex-shrink-0">
                  {getIcon(notif.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className={`text-xs ${isUnread ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                      {notif.title}
                    </p>
                    <span className="text-[10px] text-slate-400 flex items-center gap-0.5 flex-shrink-0">
                      <Clock className="w-2.5 h-2.5" />
                      {formatDate(notif.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">
                    {notif.message}
                  </p>
                  {notif.incidentId && (
                    <span className="inline-block mt-1 text-[11px] font-mono text-blue-600 hover:underline">
                      View {notif.incidentId} →
                    </span>
                  )}
                </div>
                {isUnread && (
                  <span className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0 mt-1.5" />
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
        <span className="text-[11px] text-slate-500">
          CampusSafe AI Real-time Emergency Dispatch System
        </span>
      </div>
    </div>
  );
}
