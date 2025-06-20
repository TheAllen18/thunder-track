
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Bot, Volume2, VolumeX } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Message {
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const AIVoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { type: 'ai', content: 'Hello! I\'m your AI EV Charger consultant. Ask me anything about ROI calculations, charger types, or installation tips!', timestamp: new Date() }
  ]);
  const [recognition, setRecognition] = useState<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (SpeechRecognitionAPI) {
        const recognitionInstance = new SpeechRecognitionAPI();
        recognitionInstance.continuous = false;
        recognitionInstance.interimResults = false;
        recognitionInstance.lang = 'en-US';
        
        recognitionInstance.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          handleUserMessage(transcript);
        };
        
        recognitionInstance.onend = () => {
          setIsListening(false);
        };
        
        setRecognition(recognitionInstance);
      }
    }
    
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  const handleUserMessage = (message: string) => {
    const userMessage: Message = { type: 'user', content: message, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    
    // Generate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(message);
      const aiMessage: Message = { type: 'ai', content: aiResponse, timestamp: new Date() };
      setMessages(prev => [...prev, aiMessage]);
      speakMessage(aiResponse);
    }, 1000);
  };

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('roi') || lowerMessage.includes('return')) {
      return "ROI for EV chargers typically ranges from 15-25% annually! Key factors include location, usage rates, and electricity costs. Would you like me to explain the calculation formula?";
    } else if (lowerMessage.includes('dc') || lowerMessage.includes('fast')) {
      return "DC fast chargers are excellent for high-traffic locations! They can charge vehicles 5-10x faster than AC chargers and generate more revenue per session.";
    } else if (lowerMessage.includes('ac') || lowerMessage.includes('level 2')) {
      return "AC Level 2 chargers are perfect for workplace and residential installations. Lower upfront costs and ideal for longer parking durations!";
    } else if (lowerMessage.includes('cost') || lowerMessage.includes('price')) {
      return "Installation costs vary widely! DC chargers: $15,000-50,000. AC chargers: $3,000-8,000. Don't forget about electrical upgrades and permits!";
    } else if (lowerMessage.includes('location') || lowerMessage.includes('where')) {
      return "Prime locations include shopping centers, workplaces, apartment complexes, and highway corridors. High visibility and dwell time are key!";
    } else {
      return "That's an interesting question! For EV charging investments, consider factors like location traffic, local EV adoption rates, and utility incentives. What specific aspect would you like to explore?";
    }
  };

  const speakMessage = (message: string) => {
    if (synthRef.current && !isSpeaking) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 0.8;
      utterance.onend = () => setIsSpeaking(false);
      synthRef.current.speak(utterance);
    }
  };

  const toggleListening = () => {
    if (recognition) {
      if (isListening) {
        recognition.stop();
      } else {
        recognition.start();
        setIsListening(true);
      }
    }
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <Card className="w-full max-w-md bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 shadow-xl">
      <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center justify-center gap-2">
          <Bot className="h-6 w-6 animate-pulse" />
          AI EV Consultant
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="h-64 overflow-y-auto mb-4 space-y-2 bg-white/50 rounded-lg p-3">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`p-2 rounded-lg text-sm ${
                message.type === 'user'
                  ? 'bg-blue-500 text-white ml-4'
                  : 'bg-gray-100 text-gray-800 mr-4'
              }`}
            >
              {message.content}
            </div>
          ))}
        </div>
        
        <div className="flex gap-2 justify-center">
          <Button
            onClick={toggleListening}
            variant={isListening ? "destructive" : "default"}
            size="lg"
            className={`${isListening ? 'animate-pulse' : ''}`}
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            {isListening ? 'Stop' : 'Talk'}
          </Button>
          
          <Button
            onClick={stopSpeaking}
            variant={isSpeaking ? "destructive" : "outline"}
            size="lg"
            disabled={!isSpeaking}
          >
            {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
        </div>
        
        {!recognition && (
          <p className="text-xs text-gray-500 text-center mt-2">
            Voice recognition not supported in this browser
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default AIVoiceAssistant;
