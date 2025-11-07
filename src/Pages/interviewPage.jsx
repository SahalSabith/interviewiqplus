import { useState, useEffect, useRef } from 'react';
import { Video, VideoOff, Mic, MicOff, Phone, Sun, Moon } from 'lucide-react';

export default function InterviewPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [time, setTime] = useState(0);
  const [isCallActive, setIsCallActive] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [error, setError] = useState('');
  const [isListening, setIsListening] = useState(false);

  const videoRef = useRef(null);
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const videoStreamRef = useRef(null);
  const recognitionRef = useRef(null);
  const restartTimeoutRef = useRef(null);

  // WebSocket URL
  const WS_URL = 'ws://localhost:8000/ws/interview/';

  // Timer effect
  useEffect(() => {
    let interval;
    if (isCallActive) {
      interval = setInterval(() => setTime(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isCallActive]);

  // Video stream
  useEffect(() => {
    const initVideo = async () => {
      if (videoRef.current && isVideoOn && isCallActive) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
          videoStreamRef.current = stream;
          if (videoRef.current) videoRef.current.srcObject = stream;
        } catch (err) {
          console.error('Camera access denied:', err);
          setError('Camera access denied. Video disabled.');
          setIsVideoOn(false);
        }
      } else if (!isVideoOn && videoStreamRef.current) {
        videoStreamRef.current.getTracks().forEach(t => t.stop());
        videoStreamRef.current = null;
      }
    };
    initVideo();
    return () => {
      if (videoStreamRef.current) {
        videoStreamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, [isVideoOn, isCallActive]);

  // WebSocket connect/disconnect
  useEffect(() => {
    if (isCallActive) connectWebSocket();
    else disconnectWebSocket();

    return () => {
      disconnectWebSocket();
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
    };
  }, [isCallActive]);

  // Initialize speech recognition
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Speech recognition not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      console.log('Speech recognition started');
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const lastResult = event.results[event.results.length - 1];
      if (lastResult.isFinal) {
        const transcriptText = lastResult[0].transcript.trim();
        console.log('Recognized:', transcriptText);
        
        if (transcriptText) {
          // Send to backend
          sendTranscriptToBackend(transcriptText);
          
          // Update local transcript
          setTranscript(prev => prev + (prev ? '\n\n' : '') + 'You: ' + transcriptText);
        }
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      
      if (event.error === 'no-speech') {
        // This is normal, just restart
        return;
      }
      
      if (event.error === 'not-allowed') {
        setError('Microphone access denied. Please allow microphone access.');
        setIsListening(false);
        return;
      }
      
      setIsListening(false);
    };

    recognition.onend = () => {
      console.log('Speech recognition ended');
      setIsListening(false);
      
      // Auto-restart if call is active, not muted, connected, and AI not speaking
      if (isCallActive && !isMuted && connectionStatus === 'connected' && !isAiSpeaking) {
        restartTimeoutRef.current = setTimeout(() => {
          try {
            recognition.start();
          } catch (err) {
            console.warn('Could not restart recognition:', err);
          }
        }, 500);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }
      try {
        recognition.stop();
      } catch (err) {
        // Ignore errors on cleanup
      }
    };
  }, []);

  // Control speech recognition based on state
  useEffect(() => {
    if (!recognitionRef.current) return;

    if (isCallActive && !isMuted && connectionStatus === 'connected' && !isAiSpeaking) {
      // Start recognition
      if (!isListening) {
        try {
          recognitionRef.current.start();
        } catch (err) {
          console.warn('Recognition already started or error:', err);
        }
      }
    } else {
      // Stop recognition
      if (isListening) {
        try {
          recognitionRef.current.stop();
        } catch (err) {
          console.warn('Error stopping recognition:', err);
        }
      }
    }
  }, [isCallActive, isMuted, connectionStatus, isAiSpeaking, isListening]);

  const connectWebSocket = () => {
    try {
      const ws = new WebSocket(WS_URL);
      ws.onopen = () => { 
        console.log('WS open'); 
        setConnectionStatus('connected'); 
        setError(''); 
      };
      ws.onmessage = (evt) => {
        try { 
          handleWebSocketMessage(JSON.parse(evt.data)); 
        } catch (e) { 
          console.error('Invalid WS message', e); 
        }
      };
      ws.onerror = (err) => { 
        console.error('WS error', err); 
        setError('Connection error'); 
        setConnectionStatus('error'); 
      };
      ws.onclose = () => {
        console.log('WS closed');
        setConnectionStatus('disconnected');
        if (isCallActive) {
          reconnectTimeoutRef.current = setTimeout(() => connectWebSocket(), 3000);
        }
      };
      wsRef.current = ws;
    } catch (err) {
      console.error('Failed to connect WS', err);
      setError('Failed to connect to server.');
      setConnectionStatus('error');
    }
  };

  const disconnectWebSocket = () => {
    if (wsRef.current) {
      try { wsRef.current.close(); } catch (_) {}
      wsRef.current = null;
    }
  };

  const handleWebSocketMessage = (data) => {
    console.log('WS:', data);
    switch (data.type) {
      case 'connected':
        console.log('Connected msg:', data.message);
        break;

      case 'ai_response_start':
        setIsAiSpeaking(true);
        setAiResponse('');
        break;

      case 'ai_response_chunk':
        setAiResponse(prev => prev + (data.text || ''));
        break;

      case 'ai_response_end':
        setIsAiSpeaking(true);
        if (data.full_text && data.full_text.trim()) {
          setTranscript(prev => prev + (prev ? '\n\n' : '') + 'AI: ' + data.full_text);
          speakText(data.full_text);
        } else {
          setIsAiSpeaking(false);
        }
        setAiResponse('');
        break;

      case 'processing':
        console.log('Processing...', data.message);
        break;

      case 'error':
        setError(data.message || 'Server error');
        setIsAiSpeaking(false);
        break;

      case 'info':
        console.log('Info:', data.message);
        break;

      default:
        console.log('Unknown type:', data.type);
    }
  };

  const sendTranscriptToBackend = (text) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.log('WS not open -> cannot send transcript');
      return;
    }
    
    try {
      wsRef.current.send(JSON.stringify({
        type: 'transcript',
        text: text
      }));
      console.log('Sent transcript:', text);
    } catch (err) {
      console.error('Failed to send transcript:', err);
      setError('Failed to send message to server.');
    }
  };

  const speakText = (text) => {
    if (!('speechSynthesis' in window)) {
      console.warn('SpeechSynthesis not supported');
      setIsAiSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onstart = () => {
      setIsAiSpeaking(true);
    };

    utterance.onend = () => {
      setIsAiSpeaking(false);
    };

    utterance.onerror = (e) => {
      console.error('SpeechSynthesis error', e);
      setIsAiSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    setIsCallActive(false);
    setTime(0);
    if (videoStreamRef.current) {
      videoStreamRef.current.getTracks().forEach(t => t.stop());
      videoStreamRef.current = null;
    }
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.warn('Error stopping recognition:', err);
      }
    }
    window.speechSynthesis.cancel();
    disconnectWebSocket();
  };

  const handleStartCall = () => {
    setIsCallActive(true);
    setTime(0);
    setIsVideoOn(true);
    setIsMuted(false);
    setTranscript('');
    setAiResponse('');
    setError('');
  };

  const clearTranscript = () => {
    setTranscript('');
    setAiResponse('');
  };

  // UI variables
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
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#4285F4"/>
                  <path d="M2 17L12 22L22 17V12L12 17L2 12V17Z" fill="#34A853"/>
                  <path opacity="0.5" d="M12 12V17" stroke="#FBBC04" strokeWidth="2"/>
                  <path opacity="0.5" d="M12 17V22" stroke="#EA4335" strokeWidth="2"/>
                </svg>
              </div>
              <h1 className="text-xl md:text-2xl font-bold">AI Interview <span className="text-sm font-normal text-gray-500">powered by Gemini</span></h1>
            </div>
            {connectionStatus === 'connected' && (
              <span className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-green-500">Connected</span>
              </span>
            )}
            {connectionStatus === 'error' && (
              <span className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-red-500">Connection Error</span>
              </span>
            )}
            {connectionStatus === 'disconnected' && isCallActive && (
              <span className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                <span className="text-yellow-500">Reconnecting...</span>
              </span>
            )}
          </div>
          <button onClick={() => setDarkMode(!darkMode)} className={`p-2 rounded-lg ${cardBg} hover:opacity-80 transition-opacity`} aria-label="Toggle dark mode">
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        {isCallActive ? (
          <>
            <div className="text-center mb-6">
              <div className={`inline-flex items-center gap-2 ${cardBg} px-6 py-3 rounded-full shadow-lg`}>
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-2xl font-mono font-semibold">{formatTime(time)}</span>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">
                <strong>Error:</strong> {error}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
              <div className={`${cardBg} rounded-2xl shadow-xl overflow-hidden aspect-video relative`}>
                {isVideoOn ? (
                  <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
                    <VideoOff size={64} className="text-white" />
                  </div>
                )}
                <div className="absolute bottom-4 left-4 bg-black bg-opacity-60 px-3 py-1 rounded-lg"><span className="text-white text-sm font-medium">You</span></div>
                {isListening && !isMuted && connectionStatus === 'connected' && (
                  <div className="absolute top-4 right-4 bg-red-500 bg-opacity-80 px-3 py-1 rounded-lg">
                    <span className="text-white text-xs font-medium flex items-center gap-1">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>Listening
                    </span>
                  </div>
                )}
              </div>

              <div className={`${cardBg} rounded-2xl shadow-xl overflow-hidden aspect-video relative`}>
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-white bg-opacity-20 backdrop-blur-sm flex items-center justify-center border-4 border-white border-opacity-30">
                    <svg className="w-20 h-20 md:w-24 md:h-24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white"/>
                      <path d="M2 17L12 22L22 17V12L12 17L2 12V17Z" fill="white" opacity="0.8"/>
                    </svg>
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 bg-black bg-opacity-60 px-3 py-1 rounded-lg">
                  <span className="text-white text-sm font-medium">Gemini AI Interviewer</span>
                </div>
                {isAiSpeaking && (
                  <div className="absolute top-4 right-4 bg-green-500 bg-opacity-80 px-3 py-1 rounded-lg">
                    <span className="text-white text-xs font-medium flex items-center gap-1">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>Speaking
                    </span>
                  </div>
                )}
              </div>
            </div>

            {isAiSpeaking && aiResponse && (
              <div className={`${cardBg} rounded-2xl shadow-xl p-6 mb-6 border-2 border-purple-500`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                  <h3 className="text-lg font-semibold text-purple-500">Gemini is responding...</h3>
                </div>
                <p className="text-base leading-relaxed">
                  {aiResponse}
                  <span className="inline-block w-2 h-5 bg-purple-500 animate-pulse ml-1"></span>
                </p>
              </div>
            )}

            <div className={`${cardBg} rounded-2xl shadow-xl p-6 mb-6`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Interview Transcript</h3>
                <button onClick={clearTranscript} className={`text-sm px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`}>
                  Clear
                </button>
              </div>

              <div className={`${darkMode ? 'bg-gray-900' : 'bg-gray-100'} rounded-lg p-4 min-h-48 max-h-96 overflow-y-auto`}>
                {transcript ? (
                  <div className="text-base leading-relaxed whitespace-pre-wrap space-y-3">
                    {transcript.split('\n\n').filter(l => l.trim()).map((line, idx) => {
                      if (line.startsWith('You:')) return <p key={idx} className="text-blue-500 font-medium">{line}</p>;
                      if (line.startsWith('AI:')) return <p key={idx} className="text-purple-500 font-medium">{line}</p>;
                      return <p key={idx}>{line}</p>;
                    })}
                  </div>
                ) : (
                  <p className={`${textSecondary} italic text-center py-8`}>The conversation transcript will appear here...</p>
                )}
              </div>

              <div className="mt-3 text-xs text-gray-500 space-y-1">
                <p>🎤 Speech is recognized using browser's built-in Web Speech API (works in Chrome/Edge)</p>
                <p>🤖 AI responses are generated using Google Gemini 1.5 Flash</p>
                <p>🔊 Responses are spoken aloud automatically (speech recognition pauses while AI speaks)</p>
              </div>
            </div>

            <div className="flex justify-center gap-4 flex-wrap">
              <button onClick={() => setIsMuted(m => !m)} className={`p-4 md:p-5 rounded-full ${isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'} text-white transition-all shadow-lg`} title={isMuted ? 'Unmute' : 'Mute'}>
                {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
              </button>

              <button onClick={() => setIsVideoOn(v => !v)} className={`p-4 md:p-5 rounded-full ${!isVideoOn ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'} text-white transition-all shadow-lg`} title={isVideoOn ? 'Turn off camera' : 'Turn on camera'}>
                {isVideoOn ? <Video size={24} /> : <VideoOff size={24} />}
              </button>

              <button onClick={handleEndCall} className="p-4 md:p-5 rounded-full bg-red-600 hover:bg-red-700 text-white transition-all shadow-lg" title="End interview">
                <Phone size={24} className="rotate-135" />
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <div className={`${cardBg} max-w-md mx-auto p-8 rounded-2xl shadow-xl`}>
              {time > 0 ? (
                <>
                  <h2 className="text-2xl font-bold mb-4">Interview Ended</h2>
                  <p className={`${textSecondary} mb-6`}>Total duration: {formatTime(time)}</p>
                </>
              ) : (
                <>
                  <div className="mb-6">
                    <svg className="w-24 h-24 mx-auto mb-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#4285F4"/>
                      <path d="M2 17L12 22L22 17V12L12 17L2 12V17Z" fill="#34A853"/>
                      <path opacity="0.5" d="M12 12V17" stroke="#FBBC04" strokeWidth="2"/>
                      <path opacity="0.5" d="M12 17V22" stroke="#EA4335" strokeWidth="2"/>
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold mb-4">Ready to Start?</h2>
                  <p className={`${textSecondary} mb-6`}>Begin your AI-powered mock interview with Google Gemini</p>
                </>
              )}
              <button onClick={handleStartCall} className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all shadow-lg">
                {time > 0 ? 'Start New Interview' : 'Start Interview'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}