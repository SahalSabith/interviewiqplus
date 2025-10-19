import React, { useState } from 'react';
import { User, Calendar, Briefcase, Target, Building, Award, ChevronRight, ChevronLeft, CheckCircle, Moon, Sun } from 'lucide-react';

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isDark, setIsDark] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    dob: '',
    gender: '',
    educationOccupation: '',
    studyingWorking: '',
    domainInterest: '',
    targetCompany: '',
    skills: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const onHome = () => {
    console.log('Navigate to home');
  }

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    console.log('Registration data:', formData);
  };

  const progressPercentage = (currentStep / 4) * 100;

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center px-4 py-8 transition-colors duration-300`}>
      <div className="w-full max-w-2xl">
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
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm sm:text-base`}>Create your account and start your journey</p>
        </div>

        {/* Registration Card */}
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl p-6 sm:p-8 transition-colors duration-300`}>
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <span className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Step {currentStep} of 4</span>
              <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{progressPercentage}% Complete</span>
            </div>
            <div className={`w-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-3 overflow-hidden`}>
              <div 
                className={`${isDark ? 'bg-white' : 'bg-gray-900'} h-full rounded-full transition-all duration-500 ease-out`}
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Step Indicators */}
          <div className="flex justify-between mb-8">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex flex-col items-center flex-1">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                  currentStep >= step 
                    ? isDark ? 'bg-white text-gray-900 shadow-lg' : 'bg-gray-900 text-white shadow-lg'
                    : isDark ? 'bg-gray-700 text-gray-500' : 'bg-gray-200 text-gray-400'
                }`}>
                  {currentStep > step ? <CheckCircle size={24} /> : step}
                </div>
                <span className={`text-xs sm:text-sm mt-2 font-medium ${
                  currentStep >= step ? isDark ? 'text-white' : 'text-gray-900' : isDark ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  {step === 1 && 'Personal'}
                  {step === 2 && 'Education'}
                  {step === 3 && 'Interests'}
                  {step === 4 && 'Skills'}
                </span>
              </div>
            ))}
          </div>

          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-5 animate-fadeIn">
              <h2 className={`text-2xl sm:text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-6 flex items-center gap-2`}>
                <User className={isDark ? 'text-white' : 'text-gray-900'} size={32} />
                Personal Information
              </h2>

              <div>
                <label className={`block text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 ${isDark ? 'border-gray-700 bg-gray-900 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-lg focus:${isDark ? 'border-white' : 'border-gray-900'} focus:outline-none transition-colors duration-200`}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Age
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 ${isDark ? 'border-gray-700 bg-gray-900 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-lg focus:${isDark ? 'border-white' : 'border-gray-900'} focus:outline-none transition-colors duration-200`}
                    placeholder="Enter age"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 ${isDark ? 'border-gray-700 bg-gray-900 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-lg focus:${isDark ? 'border-white' : 'border-gray-900'} focus:outline-none transition-colors duration-200`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Gender
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {['Male', 'Female', 'Other', 'Prefer not to say'].map((gender) => (
                    <button
                      key={gender}
                      type="button"
                      onClick={() => setFormData({ ...formData, gender })}
                      className={`py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                        formData.gender === gender
                          ? isDark ? 'bg-white text-gray-900 shadow-lg' : 'bg-gray-900 text-white shadow-lg'
                          : isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {gender}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Education/Occupation */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-fadeIn">
              <h2 className={`text-2xl sm:text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-6 flex items-center gap-2`}>
                <Briefcase className={isDark ? 'text-white' : 'text-gray-900'} size={32} />
                Education & Work
              </h2>

              <div>
                <label className={`block text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Current Status
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {['Student', 'Working Professional'].map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setFormData({ ...formData, educationOccupation: status })}
                      className={`py-4 px-6 rounded-lg font-semibold transition-all duration-200 ${
                        formData.educationOccupation === status
                          ? isDark ? 'bg-white text-gray-900 shadow-lg' : 'bg-gray-900 text-white shadow-lg'
                          : isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={`block text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  {formData.educationOccupation === 'Student' 
                    ? 'What are you studying?' 
                    : 'What is your current role?'}
                </label>
                <textarea
                  name="studyingWorking"
                  value={formData.studyingWorking}
                  onChange={handleChange}
                  rows="4"
                  className={`w-full px-4 py-3 border-2 ${isDark ? 'border-gray-700 bg-gray-900 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-lg focus:${isDark ? 'border-white' : 'border-gray-900'} focus:outline-none transition-colors duration-200 resize-none`}
                  placeholder={formData.educationOccupation === 'Student' 
                    ? 'e.g., Computer Science, Business Administration...' 
                    : 'e.g., Software Engineer, Product Manager...'}
                />
              </div>
            </div>
          )}

          {/* Step 3: Domain & Company */}
          {currentStep === 3 && (
            <div className="space-y-5 animate-fadeIn">
              <h2 className={`text-2xl sm:text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-6 flex items-center gap-2`}>
                <Target className={isDark ? 'text-white' : 'text-gray-900'} size={32} />
                Career Interests
              </h2>

              <div>
                <label className={`block text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Domain of Interest
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {['DSA', 'Web Dev', 'Data Science', 'Mobile Dev', 'DevOps', 'AI/ML', 'Cybersecurity', 'Cloud', 'Other'].map((domain) => (
                    <button
                      key={domain}
                      type="button"
                      onClick={() => setFormData({ ...formData, domainInterest: domain })}
                      className={`py-3 px-4 rounded-lg font-semibold transition-all duration-200 text-sm ${
                        formData.domainInterest === domain
                          ? isDark ? 'bg-white text-gray-900 shadow-lg' : 'bg-gray-900 text-white shadow-lg'
                          : isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {domain}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={`block text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  <Building className="inline mr-2" size={18} />
                  Target Company
                </label>
                <input
                  type="text"
                  name="targetCompany"
                  value={formData.targetCompany}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 ${isDark ? 'border-gray-700 bg-gray-900 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-lg focus:${isDark ? 'border-white' : 'border-gray-900'} focus:outline-none transition-colors duration-200`}
                  placeholder="e.g., Google, Microsoft, Amazon, Startup..."
                />
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-2`}>Which company would you like to prepare for?</p>
              </div>
            </div>
          )}

          {/* Step 4: Skills */}
          {currentStep === 4 && (
            <div className="space-y-5 animate-fadeIn">
              <h2 className={`text-2xl sm:text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-6 flex items-center gap-2`}>
                <Award className={isDark ? 'text-white' : 'text-gray-900'} size={32} />
                Your Skills
              </h2>

              <div>
                <label className={`block text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  Skills You're Confident In
                </label>
                <textarea
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  rows="6"
                  className={`w-full px-4 py-3 border-2 ${isDark ? 'border-gray-700 bg-gray-900 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-lg focus:${isDark ? 'border-white' : 'border-gray-900'} focus:outline-none transition-colors duration-200 resize-none`}
                  placeholder="List your technical skills, programming languages, frameworks, tools, etc.&#10;&#10;Example:&#10;- JavaScript, React, Node.js&#10;- Python, Django, Machine Learning&#10;- Problem Solving, Communication"
                />
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-2`}>Separate skills with commas or list them line by line</p>
              </div>

              <div className={`${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} border-2 rounded-lg p-4`}>
                <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>Review Your Information</h4>
                <div className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'} space-y-1`}>
                  <p><strong>Name:</strong> {formData.name || 'Not provided'}</p>
                  <p><strong>Age:</strong> {formData.age || 'Not provided'}</p>
                  <p><strong>Status:</strong> {formData.educationOccupation || 'Not provided'}</p>
                  <p><strong>Domain:</strong> {formData.domainInterest || 'Not provided'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8 gap-4">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                currentStep === 1
                  ? isDark ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <ChevronLeft size={20} />
              Back
            </button>

            {currentStep < 4 ? (
              <button
                onClick={nextStep}
                className={`flex items-center gap-2 ${isDark ? 'bg-white text-gray-900 hover:bg-gray-100' : 'bg-gray-900 text-white hover:bg-gray-800'} px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105`}
              >
                Next
                <ChevronRight size={20} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className={`flex items-center gap-2 ${isDark ? 'bg-white text-gray-900 hover:bg-gray-100' : 'bg-gray-900 text-white hover:bg-gray-800'} px-8 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105`}
              >
                <CheckCircle size={20} />
                Complete Registration
              </button>
            )}
          </div>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
              Already have an account?{' '}
              <a href="#login" className={`${isDark ? 'text-white hover:text-gray-300' : 'text-gray-900 hover:text-gray-700'} font-semibold transition-colors duration-200`}>
                Login here
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