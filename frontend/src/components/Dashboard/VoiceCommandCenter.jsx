import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Sparkles, X } from 'lucide-react';

/**
 * VoiceCommandCenter - A reusable AI voice command component
 * 
 * @param {Function} onCommand - Callback when a recognized command is processed
 * @param {Array} commands - Optional list of available commands for help display
 * @param {String} currentStatus - Optional verbal feedback for status queries
 */
const VoiceCommandCenter = ({ onCommand, commands = [], currentStatus = '' }) => {
    const [isListening, setIsListening] = useState(false);
    const [voiceTranscript, setVoiceTranscript] = useState('');
    const [voiceFeedback, setVoiceFeedback] = useState('');
    const [recognition, setRecognition] = useState(null);
    const [showHelp, setShowHelp] = useState(false);

    // Text-to-Speech function
    const speak = useCallback((text) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-IN';
            utterance.rate = 1;
            utterance.pitch = 1;
            window.speechSynthesis.speak(utterance);
        }
    }, []);

    // Initialize Speech Recognition
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recog = new SpeechRecognition();
            recog.continuous = false;
            recog.interimResults = true;
            recog.lang = 'en-IN';

            recog.onstart = () => {
                setIsListening(true);
                setVoiceFeedback('🎤 Listening...');
            };

            recog.onresult = (event) => {
                let finalTranscript = '';
                let interimTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript;
                    } else {
                        interimTranscript += transcript;
                    }
                }

                setVoiceTranscript(finalTranscript || interimTranscript);

                if (finalTranscript) {
                    processCommand(finalTranscript);
                }
            };

            recog.onend = () => {
                setIsListening(false);
            };

            recog.onerror = (event) => {
                setIsListening(false);
                if (event.error === 'not-allowed') {
                    setVoiceFeedback('❌ Mic Access Denied');
                    speak('Microphone access is denied. Please enable it in browser settings.');
                } else {
                    setVoiceFeedback(`❌ Error: ${event.error}`);
                }
                setTimeout(() => setVoiceFeedback(''), 3000);
            };

            setRecognition(recog);
        }
    }, [speak]);

    const processCommand = (transcript) => {
        const cmd = transcript.toLowerCase().trim();
        setVoiceFeedback(`Processing: "${cmd}"`);

        // Handle generic help command
        if (cmd.includes('help') || cmd.includes('commands')) {
            setShowHelp(true);
            speak('Showing available commands. You can say things like Go to Reports or Open Settings.');
            setVoiceFeedback('💡 Say "help" for commands');
        } else {
            // Forward to parent handler
            const handled = onCommand(cmd, speak);
            
            if (!handled) {
                speak("I didn't quite catch that. Please say help for a list of valid commands.");
                setVoiceFeedback('❓ Command not recognized');
            }
        }

        setTimeout(() => {
            setVoiceFeedback('');
            setVoiceTranscript('');
        }, 4000);
    };

    const toggleListening = () => {
        if (!recognition) {
            setVoiceFeedback('Voice not supported in this browser');
            return;
        }

        if (isListening) {
            recognition.stop();
        } else {
            setVoiceTranscript('');
            recognition.start();
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[2000] flex flex-col items-end gap-3">
            {/* Help Modal Overlay */}
            <AnimatePresence>
                {showHelp && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="bg-white rounded-2xl shadow-2xl p-6 border border-slate-200 mb-4 max-w-xs w-64"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <Sparkles size={16} className="text-blue-500" /> Commands
                            </h3>
                            <button onClick={() => setShowHelp(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={16} />
                            </button>
                        </div>
                        <ul className="space-y-2 text-sm text-slate-600">
                            {commands.length > 0 ? (
                                commands.map((c, i) => (
                                    <li key={i} className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                                        {c}
                                    </li>
                                ))
                            ) : (
                                <>
                                    <li>"Go to Dashboard"</li>
                                    <li>"Open Settings"</li>
                                    <li>"Logout"</li>
                                </>
                            )}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Voice Feedback Overlay */}
            <AnimatePresence>
                {(voiceFeedback || voiceTranscript) && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="bg-slate-900/95 backdrop-blur-lg text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 max-w-xs mb-2"
                    >
                        {voiceTranscript && (
                            <div className="text-sm text-blue-400 mb-1 font-medium italic">
                                🎤 "{voiceTranscript}"
                            </div>
                        )}
                        <div className="text-sm font-semibold">{voiceFeedback}</div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mic Button */}
            <motion.button
                onClick={toggleListening}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`p-4 rounded-full shadow-2xl transition-all ${
                    isListening
                        ? 'bg-gradient-to-r from-red-500 to-pink-500 ring-4 ring-red-500/50'
                        : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
                }`}
                title={isListening ? 'Stop listening' : 'AI Voice Assistant'}
            >
                {isListening ? (
                    <MicOff className="text-white" size={24} />
                ) : (
                    <Mic className="text-white" size={24} />
                )}
                
                {isListening && (
                    <motion.div
                        className="absolute inset-0 rounded-full border-4 border-red-400"
                        animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                    />
                )}
            </motion.button>
        </div>
    );
};

export default VoiceCommandCenter;
