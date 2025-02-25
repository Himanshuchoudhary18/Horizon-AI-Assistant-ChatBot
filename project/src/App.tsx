import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Sun, Moon } from 'lucide-react';
import { ChatMessage } from './components/ChatMessage';
import { qaDataset } from './data/chatData';
import type { ChatMessage as ChatMessageType } from './data/chatData';

function findBestMatch(input: string): string {
  const normalizedInput = input.toLowerCase();
  
  const matches = qaDataset.filter(qa => 
    qa.question.toLowerCase().includes(normalizedInput) ||
    normalizedInput.includes(qa.question.toLowerCase())
  );

  if (matches.length === 0) {
    return "I apologize, but I don't have enough information to provide a specific answer to that question. Could you please rephrase your question or ask about something else? I'm here to help!";
  }

  return matches.reduce((best, current) => 
    current.question.length < best.question.length ? current : best
  ).answer;
}

function App() {
  const [messages, setMessages] = useState<ChatMessageType[]>([
    {
      id: '1',
      text: "Hello! I'm your Question Answering Assistant. I'm designed to help you with a wide range of topics including technology, programming, general knowledge, and more. How can I assist you today?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateTyping = async (response: string) => {
    setIsTyping(true);
    const delay = Math.min(Math.max(response.length * 20, 1500), 3000);
    await new Promise(resolve => setTimeout(resolve, delay));
    setIsTyping(false);
    return response;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      text: input,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    const response = await simulateTyping(findBestMatch(input));
    
    const botResponse: ChatMessageType = {
      id: (Date.now() + 1).toString(),
      text: response,
      isBot: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botResponse]);
  };

  return (
    <div className={`min-h-screen mesh-background dark:bg-gray-900 p-4 flex flex-col transition-colors duration-200`}>
      <div className="max-w-4xl mx-auto w-full glass-effect dark:bg-gray-800/50 rounded-2xl shadow-lg overflow-hidden flex-1 border border-gray-100 dark:border-gray-700">
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3">
              <img src="/ai-assistant-logo.svg" alt="AI Assistant Logo" className="w-8 h-8 text-white" />
              <h1 className="text-white text-2xl font-semibold">Question Answering Assistant</h1>
            </div>
            <p className="text-white/90 mt-2">Powered by advanced knowledge base - Ask me anything!</p>
          </div>
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-white" />
            ) : (
              <Moon className="w-5 h-5 text-white" />
            )}
          </button>
        </div>
        
        <div className="h-[calc(100vh-300px)] overflow-y-auto p-6 space-y-6 dark:bg-gray-900/50">
          {messages.map((message, index) => (
            <ChatMessage 
              key={message.id} 
              message={message}
              isTyping={isTyping && index === messages.length - 1 && message.isBot}
              isDark={isDark}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="p-6 border-t border-gray-100 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask your question..."
              className="flex-1 px-6 py-4 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/80 dark:bg-gray-700/80 dark:text-white dark:placeholder-gray-400"
            />
            <button
              type="submit"
              disabled={isTyping}
              className="px-6 py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-xl hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
      <footer className="text-center text-gray-600 dark:text-gray-400 py-6 mt-6 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-xl shadow-sm">
        &copy; 2024-25 Question Answering Assistant
      </footer>
    </div>
  );
}

export default App;