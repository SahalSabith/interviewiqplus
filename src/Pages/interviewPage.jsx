import { useState, useEffect, useRef } from 'react';
import { Video, VideoOff, Mic, MicOff, Phone, Sun, Moon } from 'lucide-react';

export default function InterviewPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [time, setTime] = useState(0);
  const [isCallActive, setIsCallActive] = useState(true);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState('');
  const videoRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    let interval;
    if (isCallActive) {
      interval = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCallActive]);

  useEffect(() => {
    if (videoRef.current && isVideoOn) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(err => console.log('Camera access denied:', err));
    }
  }, [isVideoOn]);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setError('Speech recognition not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setError('');
      console.log('Speech recognition started');
    };

    recognition.onresult = (event) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPart = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcriptPart + ' ';
        } else {
          interim += transcriptPart;
        }
      }

      if (final) {
        setTranscript(prev => prev + final);
        setInterimTranscript('');
      }
      
      if (interim) {
        setInterimTranscript(interim);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'not-allowed') {
        setError('Microphone permission denied. Please allow microphone access.');
      } else if (event.error === 'no-speech') {
        console.log('No speech detected, continuing...');
      } else {
        setError(`Error: ${event.error}`);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      console.log('Speech recognition ended');
      
      // Restart if still active and not muted
      if (isCallActive && !isMuted && recognitionRef.current) {
        setTimeout(() => {
          try {
            recognitionRef.current.start();
          } catch (err) {
            console.log('Could not restart recognition:', err);
          }
        }, 100);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (err) {
          console.log('Cleanup error:', err);
        }
      }
    };
  }, [isCallActive, isMuted]);

  // Control recognition based on mute state
  useEffect(() => {
    if (!recognitionRef.current) return;

    if (isCallActive && !isMuted) {
      try {
        recognitionRef.current.start();
        console.log('Starting recognition...');
      } catch (err) {
        if (err.message.includes('already started')) {
          console.log('Recognition already active');
        } else {
          console.error('Start error:', err);
        }
      }
    } else {
      try {
        recognitionRef.current.stop();
        setIsListening(false);
      } catch (err) {
        console.log('Stop error:', err);
      }
    }
  }, [isMuted, isCallActive]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    setIsCallActive(false);
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.log('Error stopping recognition:', err);
      }
    }
  };

  const clearTranscript = () => {
    setTranscript('');
    setInterimTranscript('');
  };

  const bgClass = darkMode ? 'bg-gray-900' : 'bg-gray-50';
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const textClass = darkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600';
  const borderClass = darkMode ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className={`min-h-screen ${bgClass} ${textClass} transition-colors duration-300`}>
      {/* Header */}
      <div className={`border-b ${borderClass} px-4 py-4`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-bold">AI Interview</h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-lg ${cardBg} hover:opacity-80 transition-opacity`}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        {isCallActive ? (
          <>
            {/* Timer */}
            <div className="text-center mb-6">
              <div className={`inline-flex items-center gap-2 ${cardBg} px-6 py-3 rounded-full shadow-lg`}>
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-2xl font-mono font-semibold">{formatTime(time)}</span>
              </div>
            </div>

            {/* Video Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
              {/* User Video */}
              <div className={`${cardBg} rounded-2xl shadow-xl overflow-hidden aspect-video relative`}>
                {isVideoOn ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
                    <VideoOff size={64} className="text-white" />
                  </div>
                )}
                <div className="absolute bottom-4 left-4 bg-black bg-opacity-60 px-3 py-1 rounded-lg">
                  <span className="text-white text-sm font-medium">You</span>
                </div>
              </div>

              {/* AI Interviewer */}
              <div className={`${cardBg} rounded-2xl shadow-xl overflow-hidden aspect-video relative`}>
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-600">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-white bg-opacity-20 backdrop-blur-sm flex items-center justify-center border-4 border-white border-opacity-30">
                    <div className="text-6xl md:text-7xl">🤖</div>
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 bg-black bg-opacity-60 px-3 py-1 rounded-lg">
                  <span className="text-white text-sm font-medium">AI Interviewer</span>
                </div>
              </div>
            </div>

            {/* Live Transcription Section */}
            <div className={`${cardBg} rounded-2xl shadow-xl p-6 mb-6`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold">Live Transcription</h3>
                  {isListening && !isMuted && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm text-green-500">Listening...</span>
                    </div>
                  )}
                  {isMuted && (
                    <span className={`text-sm ${textSecondary}`}>Muted</span>
                  )}
                </div>
                <button
                  onClick={clearTranscript}
                  className={`text-sm px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`}
                >
                  Clear
                </button>
              </div>
              
              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className={`${darkMode ? 'bg-gray-900' : 'bg-gray-100'} rounded-lg p-4 min-h-32 max-h-64 overflow-y-auto`}>
                {transcript || interimTranscript ? (
                  <p className="text-base leading-relaxed whitespace-pre-wrap">
                    {transcript}
                    {interimTranscript && (
                      <span className={darkMode ? 'text-gray-500' : 'text-gray-400'}>
                        {interimTranscript}
                      </span>
                    )}
                  </p>
                ) : (
                  <p className={`${textSecondary} italic`}>
                    {isMuted 
                      ? 'Unmute your microphone to start transcription...' 
                      : 'Speak now to see your words appear here...'}
                  </p>
                )}
              </div>
              
              <div className="mt-3 text-xs text-gray-500">
                💡 Tip: Make sure to allow microphone permissions when prompted
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-4 flex-wrap">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-4 md:p-5 rounded-full ${isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'} text-white transition-all shadow-lg`}
              >
                {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
              </button>

              <button
                onClick={() => setIsVideoOn(!isVideoOn)}
                className={`p-4 md:p-5 rounded-full ${!isVideoOn ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'} text-white transition-all shadow-lg`}
              >
                {isVideoOn ? <Video size={24} /> : <VideoOff size={24} />}
              </button>

              <button
                onClick={handleEndCall}
                className="p-4 md:p-5 rounded-full bg-red-600 hover:bg-red-700 text-white transition-all shadow-lg"
              >
                <Phone size={24} className="rotate-135" />
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <div className={`${cardBg} max-w-md mx-auto p-8 rounded-2xl shadow-xl`}>
              <h2 className="text-2xl font-bold mb-4">Interview Ended</h2>
              <p className={`${textSecondary} mb-6`}>
                Total duration: {formatTime(time)}
              </p>
              <button
                onClick={() => {
                  setIsCallActive(true);
                  setTime(0);
                  setIsVideoOn(true);
                  setIsMuted(false);
                  setTranscript('');
                  setInterimTranscript('');
                  setError('');
                }}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Start New Interview
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}