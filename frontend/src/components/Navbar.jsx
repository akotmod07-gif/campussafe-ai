import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShieldAlert,
  Bell,
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  PlusCircle,
  Radio,
  ChevronDown,
  Sparkles,
  MapPin,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import NotificationDropdown from './NotificationDropdown';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, isStudent, logout, quickLogin } = useAuth();
  const { unreadCount } = useNotifications();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const handleQuickSwitch = async (role) => {
    await quickLogin(role);
    setUserDropdownOpen(false);
    if (role === 'admin') navigate('/admin/dashboard');
    else navigate('/student/dashboard');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-7">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
                <ShieldAlert className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="font-black text-lg text-slate-900 tracking-tight flex items-center gap-1">
                  CampusSafe <span className="text-blue-600">AI</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block -mt-1">
                  Safety & Triage Platform
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6 text-xs sm:text-sm font-bold text-slate-600">
              <Link
                to="/"
                className={`hover:text-blue-600 transition ${
                  location.pathname === '/' && !location.hash ? 'text-blue-600' : ''
                }`}
              >
                Home
              </Link>
              <a href="/#features" className="hover:text-blue-600 transition">
                Features
              </a>
              <a href="/#live-incidents" className="hover:text-blue-600 transition flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                Live Incidents
              </a>
              <a href="/#how-it-works" className="hover:text-blue-600 transition">
                How It Works
              </a>
              {isAuthenticated && (
                <Link
                  to={isAdmin ? '/admin/dashboard' : '/student/dashboard'}
                  className={`hover:text-blue-600 transition flex items-center gap-1 ${
                    location.pathname.includes('/dashboard') ? 'text-blue-600 font-extrabold' : ''
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
              )}
            </nav>
          </div>

          {/* Right Action Icons, SOS & CTA */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Dedicated SOS Button */}
            <Link
              to="/sos"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider transition shadow-md shadow-red-500/25 hover:scale-105 active:scale-95"
            >
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>SOS</span>
            </Link>

            {/* Prominent Report Emergency CTA */}
            <Link
              to="/report"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-blue-500/20 transition hover:scale-105 active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report Emergency</span>
            </Link>

            {/* Notifications Bell */}
            {isAuthenticated && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 relative transition"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>
                <NotificationDropdown
                  isOpen={notifOpen}
                  onClose={() => setNotifOpen(false)}
                />
              </div>
            )}

            {/* User Profile or Login */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pr-2 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition"
                >
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs uppercase">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <div className="hidden xl:block text-left">
                    <p className="text-xs font-bold text-slate-800 leading-tight">
                      {user?.name}
                    </p>
                    <span
                      className={`text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.2 rounded ${
                        isAdmin ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {user?.role}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-400">Signed in as</p>
                      <p className="text-xs font-bold text-slate-800 truncate">
                        {user?.email}
                      </p>
                      <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {user?.role === 'admin' ? 'Campus Security Admin' : 'Student Account'}
                      </span>
                    </div>

                    <div className="py-1">
                      <Link
                        to={isAdmin ? '/admin/dashboard' : '/student/dashboard'}
                        onClick={() => setUserDropdownOpen(false)}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <LayoutDashboard className="w-4 h-4 text-slate-400" />
                        Dashboard
                      </Link>

                      <Link
                        to="/report"
                        onClick={() => setUserDropdownOpen(false)}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <PlusCircle className="w-4 h-4 text-slate-400" />
                        Report Incident
                      </Link>
                    </div>

                    {/* Role Switcher for Hackathon presentations */}
                    <div className="px-3 py-2 bg-slate-50 border-y border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-500" /> Quick Role Switcher
                      </span>
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleQuickSwitch('student')}
                          className={`px-2 py-1 text-[11px] font-bold rounded-lg border transition ${
                            isStudent
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          Student
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickSwitch('admin')}
                          className={`px-2 py-1 text-[11px] font-bold rounded-lg border transition ${
                            isAdmin
                              ? 'bg-purple-600 text-white border-purple-600'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          Admin
                        </button>
                      </div>
                    </div>

                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4 text-red-500" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs font-bold text-slate-700 hover:text-blue-600 transition"
              >
                Login
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3 animate-in slide-in-from-top-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-700"
          >
            Home
          </Link>
          <a
            href="/#features"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-700"
          >
            Features
          </a>
          <a
            href="/#live-incidents"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-bold text-slate-700 flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            Live Incidents Map
          </a>
          <a
            href="/#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-700"
          >
            How It Works
          </a>
          <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2">
            <Link
              to="/sos"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 px-3 rounded-xl bg-red-600 text-white font-bold text-xs text-center flex items-center justify-center gap-1.5"
            >
              <Radio className="w-3.5 h-3.5" />
              SOS
            </Link>
            <Link
              to="/report"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2.5 px-3 rounded-xl bg-blue-600 text-white font-bold text-xs text-center flex items-center justify-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Report
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
