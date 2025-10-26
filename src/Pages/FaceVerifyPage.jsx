import React, { useState, useRef, useEffect } from 'react';
import { Camera, Mail, Moon, Sun, CheckCircle, XCircle, Loader } from 'lucide-react';

export default function FaceVerifyPage() {
  const [email, setEmail] = useState('');
  const [isDark, setIsDark] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [stream, setStream] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const webcamRef = useRef(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 } 
      });
      setStream(mediaStream);
      if (webcamRef.current) {
        webcamRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setVerificationStatus('Error accessing camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleEmailSubmit = () => {
    if (!email) {
      alert('Please enter your email address');
      return;
    }
    setShowCamera(true);
    startCamera();
  };

  const verifyFace = async () => {
    if (!webcamRef.current || !email) return;
    
    setIsVerifying(true);
    setVerificationStatus('Verifying your face...');
    
    try {
      const canvas = document.createElement('canvas');
      canvas.width = webcamRef.current.videoWidth;
      canvas.height = webcamRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(webcamRef.current, 0, 0);
      const imageSrc = canvas.toDataURL('image/jpeg');

      const response = await fetch('http://127.0.0.1:8000/api/account/verify-face/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          image: imageSrc
        })
      });

      const data = await response.json();

      if (response.ok) {
        if (data.verified) {
          setVerificationStatus('Face verified successfully! Logging you in...');
          setIsVerified(true);
          stopCamera();
          
          setTimeout(() => {
            // Redirect to dashboard or home page
            console.log('User verified, redirecting...');
            // window.location.href = '/dashboard';
          }, 2000);
        } else {
          setVerificationStatus('Face verification failed. Please try again.');
          setIsVerified(false);
        }
      } else {
        if (data.error === 'User not found') {
          setVerificationStatus('No account found with this email. Please register first.');
        } else if (data.error === 'No face detected') {
          setVerificationStatus('No face detected. Please position your face clearly.');
        } else {
          setVerificationStatus(data.error || 'Verification failed. Please try again.');
        }
        setIsVerified(false);
      }
    } catch (err) {
      console.error('Error verifying face:', err);
      setVerificationStatus('Connection error. Please check your network and try again.');
      setIsVerified(false);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleBack = () => {
    stopCamera();
    setShowCamera(false);
    setVerificationStatus('');
    setIsVerified(false);
  };

  const handleRetry = () => {
    setVerificationStatus('');
    setIsVerified(false);
    startCamera();
  };

  if (showCamera) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center px-4 py-8 transition-colors duration-300`}>
        <div className="w-full max-w-2xl">
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl p-6 sm:p-8 transition-colors duration-300`}>
            <h2 className={`text-2xl sm:text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-4 flex items-center gap-2 justify-center`}>
              <Camera className={isDark ? 'text-white' : 'text-gray-900'} size={32} />
              Face Verification
            </h2>
            
            <p className={`text-center ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
              Verifying: <span className="font-semibold">{email}</span>
            </p>
            
            <p className={`text-center ${isDark ? 'text-gray-400' : 'text-gray-500'} mb-6 text-sm`}>
              Position your face in the frame and click verify
            </p>

            <div className="flex flex-col items-center">
              <div className={`relative rounded-lg overflow-hidden ${isDark ? 'bg-gray-900' : 'bg-gray-100'} mb-6 shadow-2xl`}>
                <video
                  ref={webcamRef}
                  autoPlay
                  playsInline
                  className="w-full max-w-md rounded-lg"
                  style={{ transform: 'scaleX(-1)' }}
                />
                <div className="absolute inset-0 border-4 border-dashed border-white/30 rounded-lg pointer-events-none"></div>
                
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                  <div className="w-48 h-64 border-4 border-white/50 rounded-full"></div>
                </div>
              </div>

              {verificationStatus && (
                <div className={`mb-4 p-4 rounded-lg w-full max-w-md text-center font-semibold ${
                  verificationStatus.includes('Error') || verificationStatus.includes('failed') || verificationStatus.includes('No account')
                    ? 'bg-red-100 text-red-800' 
                    : verificationStatus.includes('successfully') 
                    ? 'bg-green-100 text-green-800'
                    : isDark ? 'bg-gray-700 text-gray-200' : 'bg-blue-100 text-blue-800'
                }`}>
                  <div className="flex items-center justify-center gap-2">
                    {verificationStatus.includes('successfully') && <CheckCircle size={20} />}
                    {(verificationStatus.includes('failed') || verificationStatus.includes('Error')) && <XCircle size={20} />}
                    {verificationStatus.includes('Verifying') && <Loader className="animate-spin" size={20} />}
                    {verificationStatus}
                  </div>
                </div>
              )}

              <div className="flex gap-4 flex-wrap justify-center">
                <button
                  onClick={verifyFace}
                  disabled={isVerifying || isVerified}
                  className={`flex items-center gap-2 ${
                    isVerifying || isVerified
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : isDark ? 'bg-white text-gray-900 hover:bg-gray-100' : 'bg-gray-900 text-white hover:bg-gray-800'
                  } px-8 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105`}
                >
                  {isVerifying ? (
                    <>
                      <Loader className="animate-spin" size={20} />
                      Verifying...
                    </>
                  ) : isVerified ? (
                    <>
                      <CheckCircle size={20} />
                      Verified!
                    </>
                  ) : (
                    <>
                      <Camera size={20} />
                      Verify Face
                    </>
                  )}
                </button>

                {(verificationStatus.includes('failed') || verificationStatus.includes('No face detected')) && !isVerifying && (
                  <button
                    onClick={handleRetry}
                    className={`flex items-center gap-2 ${isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} px-6 py-3 rounded-lg font-semibold transition-all duration-200`}
                  >
                    Retry
                  </button>
                )}
              </div>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={handleBack}
                disabled={isVerifying}
                className={`${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'} font-semibold transition-colors duration-200 ${isVerifying ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                ← Back to Email
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center px-4 py-8 transition-colors duration-300`}>
      <div className="w-full max-w-md">
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setIsDark(!isDark)}
            className={`p-3 rounded-lg ${isDark ? 'bg-gray-800 text-yellow-400' : 'bg-white text-gray-700'} shadow-lg hover:scale-105 transition-all duration-200`}
          >
            {isDark ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </div>

        <div className="text-center mb-8">
          <h1 className={`text-3xl sm:text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
            InterviewIQPlus
          </h1>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-sm sm:text-base`}>Login with Face Verification</p>
        </div>

        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl p-6 sm:p-8 transition-colors duration-300`}>
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-6 text-center`}>
            Face Login
          </h2>

          <div className="space-y-5">
            <div>
              <label className={`block text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                <Mail className="inline mr-2" size={18} />
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleEmailSubmit()}
                className={`w-full px-4 py-3 border-2 ${isDark ? 'border-gray-700 bg-gray-900 text-white' : 'border-gray-300 bg-white text-gray-900'} rounded-lg focus:${isDark ? 'border-white' : 'border-gray-900'} focus:outline-none transition-colors duration-200`}
                placeholder="your.email@example.com"
              />
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-2`}>
                Enter your registered email to proceed with face verification
              </p>
            </div>

            <button
              onClick={handleEmailSubmit}
              className={`w-full flex items-center justify-center gap-2 ${isDark ? 'bg-white text-gray-900 hover:bg-gray-100' : 'bg-gray-900 text-white hover:bg-gray-800'} px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105`}
            >
              <Camera size={20} />
              Continue to Face Verification
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
              Don't have an account?{' '}
              <a href="#register" className={`${isDark ? 'text-white hover:text-gray-300' : 'text-gray-900 hover:text-gray-700'} font-semibold transition-colors duration-200`}>
                Register here
              </a>
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <a href="#home" className={`${isDark ? 'text-white hover:text-gray-300' : 'text-gray-900 hover:text-gray-700'} font-semibold transition-colors duration-200`}>
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}