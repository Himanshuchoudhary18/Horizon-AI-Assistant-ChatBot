import React from 'react';
import { MessageSquare, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { format, isValid, parseISO } from 'date-fns';
import { useAuthStore } from '../store/authStore';

interface ChatHistoryItem {
  id: string;
  title: string;
  timestamp: Date | string;
  messages?: any[];
}

interface ChatSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  chatHistory: ChatHistoryItem[];
  onSelectChat: (id: string, messages?: any[]) => void;
  currentChatId: string | null;
  onNewChat: () => void;
}

export function ChatSidebar({ 
  isOpen, 
  onToggle, 
  chatHistory, 
  onSelectChat, 
  currentChatId,
  onNewChat
}: ChatSidebarProps) {
  const { user } = useAuthStore();

  // Function to safely format dates
  const safeFormatDate = (date: Date | string) => {
    if (!date) return 'Unknown date';
    
    try {
      // If it's a string, try to convert to Date
      const dateObj = typeof date === 'string' ? parseISO(date) : date;
      
      // Check if date is valid before formatting
      if (isValid(dateObj)) {
        return format(dateObj, 'MMM d, yyyy h:mm a');
      }
      
      return 'Invalid date';
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid date';
    }
  };

  return (
    <>
      <button
        onClick={onToggle}
        className="fixed top-20 left-0 z-30 p-2 bg-white dark:bg-gray-800 rounded-r-lg shadow-lg"
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
      >
        {isOpen ? <ChevronLeft /> : <ChevronRight />}
      </button>
      <div className={`fixed top-0 left-0 h-full z-20 transition-transform duration-300 transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="w-72 h-full bg-white dark:bg-gray-800 shadow-xl flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Chat History</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">{user?.email}</p>
            </div>
            <button 
              onClick={onNewChat}
              className="p-2 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
              aria-label="New chat"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {chatHistory && chatHistory.length > 0 ? (
              chatHistory.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => onSelectChat(chat.id, chat.messages)}
                  className={`w-full p-3 rounded-lg text-left transition-colors ${
                    currentChatId === chat.id
                      ? 'bg-purple-100 dark:bg-purple-900'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-5 h-5 text-purple-500" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                        {chat.title || 'Untitled Chat'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {safeFormatDate(chat.timestamp)}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="text-center py-8 flex flex-col items-center">
                <MessageSquare className="w-10 h-10 text-gray-300 dark:text-gray-600 mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No chat history yet
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  Start a new conversation
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}