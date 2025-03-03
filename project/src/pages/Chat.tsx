import React, { useState, useRef, useEffect } from 'react';
import { Send, Sun, Moon, Plus, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ChatMessage } from '../components/ChatMessage';
import { ChatSidebar } from '../components/ChatSidebar';
import { WebReferences } from '../components/WebReferences';
import { useAuthStore } from '../store/authStore';
import { getChatResponse, saveChatHistory, getChatHistory, updateChatHistory, deleteChat, getWebReferences } from '../lib/api';
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [webReferences, setWebReferences] = useState<any[]>([]);
  const [isLoadingReferences, setIsLoadingReferences] = useState(false);
  const [currentQuery, setCurrentQuery] = useState('');

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Close sidebar by default on mobile
      if (mobile && isSidebarOpen) {
        setIsSidebarOpen(false);
      } else if (!mobile && !isSidebarOpen) {
        // Open sidebar by default on desktop
        setIsSidebarOpen(true);
      }
    };
    
    // Initial check
    checkMobile();
    
    // Add event listener
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, [isSidebarOpen]);

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

  const fetchWebReferences = async (query: string) => {
    setIsLoadingReferences(true);
    setCurrentQuery(query);
    try {
      const references = await getWebReferences(query);
      setWebReferences(references);
    } catch (error) {
      console.error('Error fetching web references:', error);
      setWebReferences([]);
    } finally {
      setIsLoadingReferences(false);
    }
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
    setIsTyping(true);

    // Fetch web references for the query
    fetchWebReferences(input);

    try {
      const response = await getChatResponse(input);
      
      const botResponse: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        text: response,
        isBot: true,
        timestamp: new Date()
      };

      const updatedMessages = [...messages, userMessage, botResponse];
      setMessages(updatedMessages);
      
      // Save chat to history
      if (user) {
        if (currentChatId) {
          // Update existing chat
          await updateChatHistory(currentChatId, updatedMessages);
        } else {
          // Create new chat
          const result = await saveChatHistory(user.id, updatedMessages);
          if (result && result[0]) {
            setCurrentChatId(result[0].id);
          }
        }
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
      
      // Find the first user message to set as the current query for web references
      const userMessage = chatMessages.find(msg => !msg.isBot);
      if (userMessage) {
        fetchWebReferences(userMessage.text);
      } else {
        setWebReferences([]);
        setCurrentQuery('');
      }
    }
    // Close sidebar on mobile after selecting a chat
    if (isMobile) {
      setIsSidebarOpen(false);
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
    setWebReferences([]);
    setCurrentQuery('');
    // Close sidebar on mobile after creating a new chat
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  const handleDeleteChat = async (id: string) => {
    try {
      console.log('Deleting chat with ID:', id);
      const success = await deleteChat(id);
      console.log('Delete result:', success);
      
      if (success) {
        // If the deleted chat was the current one, create a new chat
        if (id === currentChatId) {
          handleNewChat();
        }
        // Reload chat history
        await loadChatHistory();
      } else {
        alert('Failed to delete chat. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
      alert('Failed to delete chat. Please try again.');
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`min-h-screen mesh-background dark:bg-gray-900 p-0 md:p-4 flex flex-col transition-colors duration-200`}>
      <ChatSidebar
        isOpen={isSidebarOpen}
        onToggle={toggleSidebar}
        chatHistory={chatHistory}
        onSelectChat={handleSelectChat}
        currentChatId={currentChatId}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        isMobile={isMobile}
      />
      
      <div className={`max-w-6xl mx-auto w-full flex flex-col md:flex-row gap-0 md:gap-4 transition-all duration-300 ${
        isSidebarOpen && !isMobile ? 'ml-0 md:ml-72' : ''
      }`}>
        {/* Main Chat Area */}
        <div className="glass-effect dark:bg-gray-800/50 rounded-none md:rounded-2xl shadow-lg overflow-hidden flex-1 border border-gray-100 dark:border-gray-700">
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4 md:p-6 flex justify-between items-center">
            <div className="flex items-center gap-2">
              {isMobile && (
                <button
                  onClick={toggleSidebar}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors mr-2"
                  aria-label="Toggle sidebar"
                >
                  <Menu className="w-5 h-5 text-white" />
                </button>
              )}
              <div>
                <div className="flex items-center gap-2 md:gap-3">
                  <img src="/ai-assistant-logo.svg" alt="AI Assistant Logo" className="w-6 h-6 md:w-8 md:h-8" />
                  <h1 className="text-white text-lg md:text-2xl font-semibold">AI Assistant</h1>
                </div>
                <p className="text-white/90 text-xs md:text-sm mt-1 md:mt-2 hidden md:block">Powered by OpenAI - Ask me anything!</p>
              </div>
            </div>
            <div className="flex items-center gap-1 md:gap-2">
              <button
                onClick={handleNewChat}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="New chat"
              >
                <Plus className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </button>
              <button
                onClick={() => setIsDark(!isDark)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <Sun className="w-4 h-4 md:w-5 md:h-5 text-white" />
                ) : (
                  <Moon className="w-4 h-4 md:w-5 md:h-5 text-white" />
                )}
              </button>
              <button
                onClick={handleSignOut}
                className="px-2 py-1 md:px-4 md:py-2 text-xs md:text-sm rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white"
              >
                Sign Out
              </button>
            </div>
          </div>
          
          <div className="h-[calc(100vh-200px)] md:h-[calc(100vh-300px)] overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6 dark:bg-gray-900/50">
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

          <form onSubmit={handleSubmit} className="p-4 md:p-6 border-t border-gray-100 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur">
            <div className="flex flex-col gap-2 md:gap-3">
              <div className="flex gap-2 md:gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask your question..."
                  className="flex-1 px-4 py-3 text-sm md:text-base border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/80 dark:bg-gray-700/80 dark:text-white dark:placeholder-gray-400"
                />
                <button
                  type="submit"
                  disabled={isTyping}
                  className="px-4 py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-xl hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                AI Assistant can make mistakes. Consider checking important information.
              </p>
            </div>
          </form>
        </div>
        
        {/* Web References Panel - Hidden on mobile */}
        <div className="hidden md:block w-80 glass-effect dark:bg-gray-800/50 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 h-[calc(100vh-2rem)]">
          <WebReferences 
            references={webReferences} 
            isLoading={isLoadingReferences} 
            query={currentQuery} 
          />
        </div>
      </div>
    </div>
  );
}