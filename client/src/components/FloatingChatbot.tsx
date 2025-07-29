import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { websiteConfig, personalInfo } from "@/data/website-data";
import { generateGeminiResponse } from "@/services/gemini-api";

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: websiteConfig.chatbotGreeting,
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: currentMessage,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Use Gemini AI to generate response
      const botResponseText = await generateGeminiResponse(currentMessage);
      
      const botResponse: Message = {
        id: Date.now() + 1,
        text: botResponseText,
        isBot: true,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error generating response:', error);
      
      // Fallback response if API fails
      const fallbackResponse: Message = {
        id: Date.now() + 1,
        text: "I'm sorry, I'm having trouble connecting right now. Please try asking about Bharathi's education, skills, projects, or experience!",
        isBot: true,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, fallbackResponse]);
    } finally {
      setIsLoading(false);
      setCurrentMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      sendMessage();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-20">
      {/* Chat Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-r from-violet-500 to-violet-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
      >
        <i className={`fas ${isOpen ? "fa-times" : "fa-comments"} text-lg md:text-xl`}></i>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-14 md:bottom-16 right-0 w-72 md:w-80 h-80 md:h-96 glass-violet rounded-xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-3 md:p-4 border-b border-violet-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-7 h-7 md:w-8 md:h-8 bg-gradient-to-r from-violet-500 to-violet-600 rounded-full flex items-center justify-center text-white text-xs md:text-sm font-bold">
                    B
                  </div>
                  <div className="ml-2 md:ml-3">
                    <h4 className="font-medium text-slate-800 text-sm md:text-base">{websiteConfig.chatbotName}</h4>
                    <p className="text-xs text-slate-600">Ask me about my portfolio!</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {/* Social Links */}
                  <a
                    href={personalInfo.socialLinks.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-500 hover:text-violet-600 transition-colors p-1"
                    aria-label="GitHub"
                  >
                    <i className="fab fa-github text-sm"></i>
                  </a>
                  <a
                    href={personalInfo.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-500 hover:text-violet-600 transition-colors p-1"
                    aria-label="LinkedIn"
                  >
                    <i className="fab fa-linkedin text-sm"></i>
                  </a>
                  <a
                    href={`mailto:${personalInfo.email}`}
                    className="text-slate-500 hover:text-violet-600 transition-colors p-1"
                    aria-label="Email"
                  >
                    <i className="fas fa-envelope text-sm"></i>
                  </a>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-slate-500 hover:text-slate-700 p-1"
                  >
                    <i className="fas fa-times text-sm"></i>
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-3 md:p-4 overflow-y-auto max-h-48 md:max-h-64 space-y-3 md:space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`max-w-xs p-2 md:p-3 rounded-lg text-xs md:text-sm leading-relaxed ${
                      message.isBot
                        ? "bg-violet-100 text-slate-700"
                        : "bg-violet-500 text-white"
                    }`}
                  >
                    {message.text}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Typing Indicator - Positioned above input */}
            <AnimatePresence>
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="px-3 md:px-4 pb-2 flex justify-center"
                >
                  <div className="flex items-center space-x-2 text-violet-600 text-xs md:text-sm">
                    <div className="flex space-x-1">
                      <motion.div
                        animate={{ 
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 1, 0.5]
                        }}
                        transition={{ 
                          duration: 1.2, 
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className="w-1.5 h-1.5 md:w-2 md:h-2 bg-violet-500 rounded-full"
                      />
                      <motion.div
                        animate={{ 
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 1, 0.5]
                        }}
                        transition={{ 
                          duration: 1.2, 
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 0.2
                        }}
                        className="w-1.5 h-1.5 md:w-2 md:h-2 bg-violet-500 rounded-full"
                      />
                      <motion.div
                        animate={{ 
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 1, 0.5]
                        }}
                        transition={{ 
                          duration: 1.2, 
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 0.4
                        }}
                        className="w-1.5 h-1.5 md:w-2 md:h-2 bg-violet-500 rounded-full"
                      />
                    </div>
                    <motion.span
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ 
                        duration: 1.5, 
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="font-medium"
                    >
                      Bot is typing...
                    </motion.span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input */}
            <div className="p-3 md:p-4 border-t border-violet-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Ask about my portfolio..."
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 px-2 md:px-3 py-2 text-xs md:text-sm glass rounded-lg border-0 focus:ring-2 focus:ring-violet-500"
                />
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={sendMessage}
                  disabled={isLoading || !currentMessage.trim()}
                  className="px-3 md:px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition-colors text-xs md:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i className="fas fa-paper-plane"></i>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
