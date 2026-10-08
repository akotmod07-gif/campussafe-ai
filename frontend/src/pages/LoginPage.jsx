import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShieldAlert,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  User,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DEMO_CREDENTIALS } from '../utils/constants';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleAutofill = (role) => {
    const creds = DEMO_CREDENTIALS[role];
    setEmail(creds.email);
    setPassword(creds.password);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const loggedInUser = await login(email, password, rememberMe);
      const redirectPath = loggedInUser.role === 'admin' ? '/admin/dashboard' : '/student/dashboard';
      navigate(location.state?.from?.pathname || redirectPath, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid credentials. Use demo accounts below.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="max-w-md w-full space-y-6">
        {/* Brand Card Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white mx-auto flex items-center justify-center shadow-lg shadow-blue-500/30">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Sign In to CampusSafe AI
          </h2>
          <p className="text-xs text-slate-500">
            Access student safety dispatch or campus security operations console
          </p>
        </div>

        {/* DEMO CREDENTIALS QUICK-FILL BOX */}
        <div className="bg-gradient-to-br from-blue-900 to-slate-900 rounded-2xl p-4 text-white shadow-lg border border-blue-500/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-blue-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              1-Click Demo Accounts (Hackathon)
            </span>
            <span className="text-[10px] bg-blue-500/30 text-blue-200 px-2 py-0.5 rounded-full font-mono">
              Demo Ready
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleAutofill('student')}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-left transition group"
            >
              <div className="text-[11px] font-bold text-white flex items-center justify-between">
                <span>Student Demo</span>
                <ArrowRight className="w-3 h-3 text-blue-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <p className="text-[10px] text-slate-300 font-mono truncate mt-0.5">student@campus.com</p>
              <p className="text-[9px] text-slate-400">Pass: student123</p>
            </button>

            <button
              type="button"
              onClick={() => handleAutofill('admin')}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-left transition group"
            >
              <div className="text-[11px] font-bold text-white flex items-center justify-between">
                <span>Admin Demo</span>
                <ArrowRight className="w-3 h-3 text-purple-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <p className="text-[10px] text-slate-300 font-mono truncate mt-0.5">admin@campus.com</p>
              <p className="text-[9px] text-slate-400">Pass: admin123</p>
            </button>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl shadow-slate-200/50 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                Campus Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@campus.com"
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 font-medium">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                />
                Remember me on this device
              </label>
              <span className="text-slate-400 text-[11px]">Protected by JWT & bcrypt</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-500/25 transition flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Verifying Credentials...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer link to Register */}
          <div className="pt-4 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              New to CampusSafe?{' '}
              <Link to="/register" className="font-bold text-blue-600 hover:underline">
                Create Student Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
