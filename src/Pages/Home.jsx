import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Menu, X, Play, CheckCircle, Clock, Shield, Zap, Star, Facebook, Twitter, Linkedin, Instagram, Moon, Sun } from 'lucide-react';
import { logout } from '../redux/slices/authslice';

// Header Component
const Header = ({ isDark, setIsDark }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const onLogin = () => {
    navigate('/login');
  };

  const onRegister = () => {
    navigate('/register');
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleStartInterview = () => {
    if (isAuthenticated) {
      navigate('/interview');
    } else {
      navigate('/register');
    }
  };

  return (
    <header className={`${isDark ? 'bg-gray-900' : 'bg-white'} shadow-lg sticky top-0 z-50 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0 cursor-pointer" onClick={() => navigate('/')}>
            <h1 className={`text-2xl sm:text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              InterviewIQPlus
            </h1>
          </div>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex items-center space-x-8">
            <li><a href="#home" className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'} font-medium transition-colors duration-200`}>Home</a></li>
            <li>
              <button 
                onClick={handleStartInterview}
                className={`${isDark ? 'bg-white text-gray-900 hover:bg-gray-100' : 'bg-gray-900 text-white hover:bg-gray-800'} px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg`}
              >
                Start Interview
              </button>
            </li>
            <li><a href="#subscription" className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'} font-medium transition-colors duration-200`}>Subscription</a></li>
            {isAuthenticated && <li><a href="#history" className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'} font-medium transition-colors duration-200`}>History</a></li>}
            <li><a href="#about" className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'} font-medium transition-colors duration-200`}>About</a></li>
            <li><a href="#contact" className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'} font-medium transition-colors duration-200`}>Contact & Feedback</a></li>
          </ul>

          {/* Auth Buttons & Theme Toggle - Desktop */}
          <div className="hidden lg:flex items-center space-x-4">
            <button
              onClick={() => setIsDark(!isDark)}
              className={`p-2 rounded-lg ${isDark ? 'bg-gray-800 text-yellow-400' : 'bg-gray-100 text-gray-700'} hover:scale-105 transition-all duration-200`}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            {isAuthenticated ? (
              <>
                <span className={`${isDark ? 'text-white' : 'text-gray-900'} font-medium`}>
                  Hi, {user?.full_name?.split(' ')[0]}
                </span>
                <button 
                  onClick={handleLogout}
                  className={`${isDark ? 'text-white border-white hover:bg-white hover:text-gray-900' : 'text-gray-900 border-gray-900 hover:bg-gray-900 hover:text-white'} border-2 px-6 py-2 rounded-lg font-semibold transition-all duration-200`}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button onClick={onLogin} className={`${isDark ? 'text-white border-white hover:bg-white hover:text-gray-900' : 'text-gray-900 border-gray-900 hover:bg-gray-900 hover:text-white'} border-2 px-6 py-2 rounded-lg font-semibold transition-all duration-200`}>
                  Login
                </button>
                <button onClick={onRegister} className={`${isDark ? 'bg-white text-gray-900 hover:bg-gray-100' : 'bg-gray-900 text-white hover:bg-gray-800'} px-6 py-2 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg`}>
                  Register
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className={`lg:hidden p-2 rounded-lg ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition-colors duration-200`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={28} className={isDark ? 'text-white' : 'text-gray-700'} /> : <Menu size={28} className={isDark ? 'text-white' : 'text-gray-700'} />}
          </button>
        </nav>

        {/* Mobile Navigation */}
        {menuOpen && (
          <div className="lg:hidden pb-6 animate-fadeIn">
            <ul className="space-y-3">
              <li><a href="#home" className={`block py-3 px-4 ${isDark ? 'text-gray-300 hover:bg-gray-800 hover:text-white' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'} rounded-lg font-medium transition-all duration-200`}>Home</a></li>
              <li>
                <button 
                  onClick={handleStartInterview}
                  className={`w-full text-left py-3 px-4 ${isDark ? 'bg-white text-gray-900 hover:bg-gray-100' : 'bg-gray-900 text-white hover:bg-gray-800'} rounded-lg font-medium transition-all duration-200`}
                >
                  Start Interview
                </button>
              </li>
              <li><a href="#subscription" className={`block py-3 px-4 ${isDark ? 'text-gray-300 hover:bg-gray-800 hover:text-white' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'} rounded-lg font-medium transition-all duration-200`}>Subscription</a></li>
              {isAuthenticated && <li><a href="#history" className={`block py-3 px-4 ${isDark ? 'text-gray-300 hover:bg-gray-800 hover:text-white' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'} rounded-lg font-medium transition-all duration-200`}>History</a></li>}
              <li><a href="#about" className={`block py-3 px-4 ${isDark ? 'text-gray-300 hover:bg-gray-800 hover:text-white' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'} rounded-lg font-medium transition-all duration-200`}>About</a></li>
              <li><a href="#contact" className={`block py-3 px-4 ${isDark ? 'text-gray-300 hover:bg-gray-800 hover:text-white' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'} rounded-lg font-medium transition-all duration-200`}>Contact & Feedback</a></li>
            </ul>
            <div className="flex flex-col space-y-3 mt-6">
              <button
                onClick={() => setIsDark(!isDark)}
                className={`py-3 px-6 ${isDark ? 'bg-gray-800 text-yellow-400' : 'bg-gray-100 text-gray-700'} rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2`}
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
                {isDark ? 'Light Mode' : 'Dark Mode'}
              </button>
              {isAuthenticated ? (
                <>
                  <div className={`py-3 px-6 ${isDark ? 'text-white' : 'text-gray-900'} text-center font-medium`}>
                    Hi, {user?.full_name}
                  </div>
                  <button 
                    onClick={handleLogout}
                    className={`py-3 px-6 ${isDark ? 'text-white border-white hover:bg-white hover:text-gray-900' : 'text-gray-900 border-gray-900 hover:bg-gray-900 hover:text-white'} border-2 rounded-lg font-semibold transition-all duration-200`}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button onClick={onLogin} className={`py-3 px-6 ${isDark ? 'text-white border-white hover:bg-white hover:text-gray-900' : 'text-gray-900 border-gray-900 hover:bg-gray-900 hover:text-white'} border-2 rounded-lg font-semibold transition-all duration-200`}>
                    Login
                  </button>
                  <button onClick={onRegister} className={`py-3 px-6 ${isDark ? 'bg-white text-gray-900 hover:bg-gray-100' : 'bg-gray-900 text-white hover:bg-gray-800'} rounded-lg font-semibold transition-all duration-200`}>
                    Register
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

// Main App Component
export default function HomePage() {
  const [isDark, setIsDark] = useState(false);
  const navigate = useNavigate();

  const features = [
    {
      icon: <Zap className={`w-12 h-12 ${isDark ? 'text-white' : 'text-gray-900'}`} />,
      title: "Cost Saving",
      description: "Practice unlimited interviews without expensive coaching fees"
    },
    {
      icon: <Clock className={`w-12 h-12 ${isDark ? 'text-white' : 'text-gray-900'}`} />,
      title: "24/7 Availability",
      description: "Interview practice anytime, anywhere at your convenience"
    },
    {
      icon: <Shield className={`w-12 h-12 ${isDark ? 'text-white' : 'text-gray-900'}`} />,
      title: "No Judgment",
      description: "Practice in a safe, pressure-free environment"
    },
    {
      icon: <CheckCircle className={`w-12 h-12 ${isDark ? 'text-white' : 'text-gray-900'}`} />,
      title: "Instant Feedback",
      description: "Get immediate AI-powered insights to improve your performance"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Software Engineer",
      content: "InterviewIQPlus helped me land my dream job! The AI feedback was incredibly detailed and helped me improve my answers.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Product Manager",
      content: "The 24/7 availability meant I could practice at my own pace. This tool is a game-changer for interview preparation.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Data Analyst",
      content: "I was nervous about interviews, but practicing with InterviewIQPlus gave me the confidence I needed. Highly recommend!",
      rating: 5
    }
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-white'} transition-colors duration-300`}>
      {/* Header */}
      <Header isDark={isDark} setIsDark={setIsDark} />

      {/* Hero Section */}
      <section className={`relative ${isDark ? 'bg-gray-800' : 'bg-gray-100'} overflow-hidden transition-colors duration-300`}>
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-32`}>
          <div className="text-center">
            <h1 className={`text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-6 leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
              AI-Powered Mock Interviews<br />
              <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>Anytime, Anywhere</span>
            </h1>
            <p className={`text-lg sm:text-xl lg:text-2xl mb-10 max-w-3xl mx-auto ${isDark ? 'text-gray-400' : 'text-gray-600'} leading-relaxed`}>
              Master your interview skills with intelligent AI feedback and practice sessions tailored to your career goals
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
              <button 
                onClick={() => navigate('/register')}
                className={`w-full sm:w-auto ${isDark ? 'bg-white text-gray-900 hover:bg-gray-100' : 'bg-gray-900 text-white hover:bg-gray-800'} px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 shadow-2xl hover:shadow-xl hover:scale-105 transform`}
              >
                Start Free Interview
              </button>
              <button className={`w-full sm:w-auto ${isDark ? 'bg-transparent border-3 border-white text-white hover:bg-white hover:text-gray-900' : 'bg-transparent border-3 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white'} px-8 py-4 rounded-xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 transform`}>
                View Subscription Plans
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={`py-16 sm:py-20 lg:py-24 ${isDark ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold text-center ${isDark ? 'text-white' : 'text-gray-900'} mb-12 sm:mb-16`}>
            Why InterviewIQPlus?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 text-center`}
              >
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className={`text-xl sm:text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-3`}>{feature.title}</h3>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} leading-relaxed`}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className={`py-16 sm:py-20 lg:py-24 ${isDark ? 'bg-gray-800' : 'bg-white'} transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold text-center ${isDark ? 'text-white' : 'text-gray-900'} mb-12 sm:mb-16`}>
            See It In Action
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="relative group cursor-pointer">
              <div className={`${isDark ? 'bg-gray-700' : 'bg-gray-900'} rounded-2xl aspect-video flex flex-col items-center justify-center text-white shadow-2xl transition-transform duration-300 group-hover:scale-105`}>
                <Play size={80} className="mb-4 group-hover:scale-110 transition-transform duration-300" />
                <p className="text-xl sm:text-2xl font-bold">Watch Demo</p>
              </div>
            </div>
            <div>
              <h3 className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-6`}>
                Experience the Future of Interview Preparation
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-1" />
                  <span className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Realistic interview scenarios</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-1" />
                  <span className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>AI-powered question generation</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-1" />
                  <span className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Comprehensive performance analysis</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-500 mr-3 flex-shrink-0 mt-1" />
                  <span className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Personalized improvement tips</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={`py-16 sm:py-20 lg:py-24 ${isDark ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold text-center ${isDark ? 'text-white' : 'text-gray-900'} mb-12 sm:mb-16`}>
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className={`${isDark ? 'bg-gray-800' : 'bg-white'} p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2`}
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={20} fill="#fbbf24" color="#fbbf24" />
                  ))}
                </div>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} italic mb-6 leading-relaxed text-base sm:text-lg`}>
                  "{testimonial.content}"
                </p>
                <div>
                  <p className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'} text-lg`}>{testimonial.name}</p>
                  <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-sm`}>{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`${isDark ? 'bg-black' : 'bg-gray-900'} text-white py-12 sm:py-16 transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-8">
            <div>
              <h4 className="text-xl sm:text-2xl font-bold text-white mb-4">InterviewIQPlus</h4>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-400'} leading-relaxed`}>
                Your AI-powered interview assistant for career success
              </p>
            </div>
            <div>
              <h4 className="text-lg sm:text-xl font-bold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#privacy" className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-white'} transition-colors duration-200`}>Privacy Policy</a></li>
                <li><a href="#terms" className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-white'} transition-colors duration-200`}>Terms & Conditions</a></li>
                <li><a href="#support" className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-white'} transition-colors duration-200`}>Support</a></li>
                <li><a href="#careers" className={`${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-white'} transition-colors duration-200`}>Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg sm:text-xl font-bold text-white mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>support@interviewiqplus.com</li>
                <li>+1 (555) 123-4567</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg sm:text-xl font-bold text-white mb-4">Follow Us</h4>
              <div className="flex gap-4">
                <a href="#" className={`w-10 h-10 ${isDark ? 'bg-gray-900 hover:bg-gray-700' : 'bg-gray-800 hover:bg-gray-700'} rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-110`}>
                  <Facebook size={20} />
                </a>
                <a href="#" className={`w-10 h-10 ${isDark ? 'bg-gray-900 hover:bg-gray-700' : 'bg-gray-800 hover:bg-gray-700'} rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-110`}>
                  <Twitter size={20} />
                </a>
                <a href="#" className={`w-10 h-10 ${isDark ? 'bg-gray-900 hover:bg-gray-700' : 'bg-gray-800 hover:bg-gray-700'} rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-110`}>
                  <Linkedin size={20} />
                </a>
                <a href="#" className={`w-10 h-10 ${isDark ? 'bg-gray-900 hover:bg-gray-700' : 'bg-gray-800 hover:bg-gray-700'} rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-110`}>
                  <Instagram size={20} />
                </a>
              </div>
            </div>
          </div>
          <div className={`border-t ${isDark ? 'border-gray-900' : 'border-gray-800'} pt-8 text-center`}>
            <p className="text-gray-400">&copy; 2025 InterviewIQPlus. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}