import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, Moon, Sun } from 'lucide-react';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [formData, setFormData] = useState({
    emailOrMobile: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    console.log('Login data:', formData);
  };

  const onHome = () => {
    console.log('Navigate to home');
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center px-4 py-8 transition-colors duration-300`}>
      <div className="w-full max-w-md">
        {/* Theme Toggle */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setIsDark(!isDark)}
            className={`p-3 rounded-lg ${isDark ? 'bg-gray-800 text-yellow-400' : 'bg-white text-gray-700'} shadow-lg hover:scale-105 transition-all duration-200`}
          >
            {isDark ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </div>

        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className={`text-3xl sm:text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
            InterviewIQPlus
          </h1>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm sm:text-base`}>Welcome back! Please login to your account</p>
        </div>

        {/* Login Card */}
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl p-6 sm:p-8 transition-colors duration-300`}>
          <h2 className={`text-2xl sm:text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-6 text-center`}>Login</h2>

          <div className="space-y-5">
            {/* Email or Mobile Input */}
            <div>
              <label className={`block text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                Email or Mobile Number
              </label>
              <div className="relative">
                <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} size={20} />
                <input
                  type="text"
                  name="emailOrMobile"
                  value={formData.emailOrMobile}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-4 py-3 border-2 ${isDark ? 'border-gray-700 bg-gray-900 text-white placeholder-gray-500' : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400'} rounded-lg focus:${isDark ? 'border-white' : 'border-gray-900'} focus:outline-none transition-colors duration-200`}
                  placeholder="Enter email or mobile"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className={`block text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                Password
              </label>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-12 py-3 border-2 ${isDark ? 'border-gray-700 bg-gray-900 text-white placeholder-gray-500' : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400'} rounded-lg focus:${isDark ? 'border-white' : 'border-gray-900'} focus:outline-none transition-colors duration-200`}
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <a href="#forgot" className={`text-sm ${isDark ? 'text-white hover:text-gray-300' : 'text-gray-900 hover:text-gray-700'} font-semibold transition-colors duration-200`}>
                Forgot Password?
              </a>
            </div>

            {/* Login Button */}
            <button
              onClick={handleSubmit}
              className={`w-full ${isDark ? 'bg-white text-gray-900 hover:bg-gray-100' : 'bg-gray-900 text-white hover:bg-gray-800'} py-3 rounded-lg font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105`}
            >
              Login
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className={`flex-1 border-t ${isDark ? 'border-gray-700' : 'border-gray-300'}`}></div>
            <span className={`px-4 ${isDark ? 'text-gray-400' : 'text-gray-500'} text-sm`}>OR</span>
            <div className={`flex-1 border-t ${isDark ? 'border-gray-700' : 'border-gray-300'}`}></div>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-3">
            <button className={`w-full flex items-center justify-center gap-3 ${isDark ? 'bg-gray-900 border-gray-700 text-gray-300 hover:bg-gray-950 hover:border-gray-600' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'} border-2 py-3 rounded-lg font-semibold transition-all duration-200 shadow-sm hover:shadow-md`}>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <button className={`w-full flex items-center justify-center gap-3 ${isDark ? 'bg-gray-900 border-gray-700 text-gray-300 hover:bg-gray-950 hover:border-gray-600' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'} border-2 py-3 rounded-lg font-semibold transition-all duration-200 shadow-sm hover:shadow-md`}>
              <svg className="w-5 h-5" fill="#0A66C2" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              Continue with LinkedIn
            </button>
          </div>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
              Don't have an account?{' '}
              <a href="#register" className={`${isDark ? 'text-white hover:text-gray-300' : 'text-gray-900 hover:text-gray-700'} font-semibold transition-colors duration-200`}>
                Register here
              </a>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <a onClick={onHome} className={`${isDark ? 'text-white hover:text-gray-300' : 'text-gray-900 hover:text-gray-700'} font-semibold transition-colors duration-200 cursor-pointer`}>
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}