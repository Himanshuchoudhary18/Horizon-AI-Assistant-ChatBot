import React, { useState, useRef, useEffect } from 'react';
import { Send, Sun, Moon, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ChatMessage } from '../components/ChatMessage';
import { ChatSidebar } from '../components/ChatSidebar';
import { useAuthStore } from '../store/authStore';
import { getChatResponse, saveChatHistory, getChatHistory } from '../lib/api';
import type { ChatMessage as ChatMessageType } from '../data/chatData';

export function Chat() {
  const { user, signOut } = useAuthStore();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessageType[]>([
    {
      id: '1',
      text: `Hello ${user?.user_metadata?.username || 'there'}! I'm your AI Assistant. How can I help you today?`,
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    if (user) {
      loadChatHistory();
    }
  }, [user]);

  const loadChatHistory = async () => {
    try {
      const history = await getChatHistory(user!.id);
      setChatHistory(history || []);
    } catch (error) {
      console.error('Error loading chat history:', error);
      setChatHistory([]);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
    setIsTyping(true);

    try {
      const response = await getChatResponse(input);
      
      const botResponse: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        text: response,
        isBot: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
      
      // Save chat to history
      if (user) {
        await saveChatHistory(user.id, [...messages, userMessage, botResponse]);
        loadChatHistory(); // Reload chat history
      }
    } catch (error) {
      console.error('Error getting response:', error);
      
      // Add error message
      const errorResponse: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I couldn't process your request. Please try again later.",
        isBot: true,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSignOut = () => {
    navigate('/logout');
  };

  const handleSelectChat = (id: string, chatMessages?: any[]) => {
    setCurrentChatId(id);
    if (chatMessages && Array.isArray(chatMessages)) {
      setMessages(chatMessages);
    }
  };

  const handleNewChat = () => {
    setCurrentChatId(null);
    setMessages([
      {
        id: '1',
        text: `Hello ${user?.user_metadata?.username || 'there'}! I'm your AI Assistant. How can I help you today?`,
        isBot: true,
        timestamp: new Date()
      }
    ]);
  };

  return (
    <div className={`min-h-screen mesh-background dark:bg-gray-900 p-4 flex flex-col transition-colors duration-200`}>
      <ChatSidebar
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        chatHistory={chatHistory}
        onSelectChat={handleSelectChat}
        currentChatId={currentChatId}
        onNewChat={handleNewChat}
      />
      
      <div className={`max-w-4xl mx-auto w-full glass-effect dark:bg-gray-800/50 rounded-2xl shadow-lg overflow-hidden flex-1 border border-gray-100 dark:border-gray-700 transition-all duration-300 ${
        isSidebarOpen ? 'ml-72' : ''
      }`}>
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3">
              <img src="/ai-assistant-logo.svg" alt="AI Assistant Logo" className="w-8 h-8" />
              <h1 className="text-white text-2xl font-semibold">AI Assistant</h1>
            </div>
            <p className="text-white/90 mt-2">Powered by OpenAI - Ask me anything!</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleNewChat}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="New chat"
            >
              <Plus className="w-5 h-5 text-white" />
            </button>
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
            <button
              onClick={handleSignOut}
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white"
            >
              Sign Out
            </button>
          </div>
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
          <div className="flex flex-col gap-3">
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
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              AI Assistant can make mistakes. Consider checking important information.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}