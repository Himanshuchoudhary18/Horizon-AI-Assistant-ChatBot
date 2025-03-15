import React, { useState } from 'react';
import { MessageSquare, ChevronLeft, ChevronRight, Plus, X, Trash2, Share2, Edit2, Archive } from 'lucide-react';
import { format, isValid, parseISO } from 'date-fns';
import { useAuthStore } from '../store/authStore';

interface ChatHistoryItem {
  id: string;
  title: string;
  timestamp: Date | string;
  messages?: any[];
  archived?: boolean;
}

interface ChatSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  chatHistory: ChatHistoryItem[];
  onSelectChat: (id: string, messages?: any[]) => void;
  currentChatId: string | null;
  onNewChat: () => void;
  onDeleteChat: (id: string) => void;
  onRenameChat: (id: string, newTitle: string) => void;
  onArchiveChat: (id: string, archive: boolean) => void;
  onShareChat: (id: string) => void;
  isMobile?: boolean;
}

export function ChatSidebar({ 
  isOpen, 
  onToggle, 
  chatHistory, 
  onSelectChat, 
  currentChatId,
  onNewChat,
  onDeleteChat,
  onRenameChat,
  onArchiveChat,
  onShareChat,
  isMobile = false
}: ChatSidebarProps) {
  const { user } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');

  const safeFormatDate = (date: Date | string) => {
    if (!date) return 'Unknown date';
    
    try {
      const dateObj = typeof date === 'string' ? parseISO(date) : date;
      if (isValid(dateObj)) {
        return format(dateObj, 'MMM d, yyyy h:mm a');
      }
      return 'Invalid date';
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid date';
    }
  };

  const handleDeleteChat = async (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this chat? This action cannot be undone.')) {
      await onDeleteChat(chatId);
      setMenuOpen(null);
    }
  };

  const handleRenameClick = (e: React.MouseEvent, chatId: string, currentTitle: string) => {
    e.stopPropagation();
    setEditingTitle(chatId);
    setNewTitle(currentTitle);
    setMenuOpen(null);
  };

  const handleRenameSubmit = (e: React.FormEvent, chatId: string) => {
    e.preventDefault();
    if (newTitle.trim()) {
      onRenameChat(chatId, newTitle.trim());
      setEditingTitle(null);
      setNewTitle('');
    }
  };

  const handleArchiveClick = (e: React.MouseEvent, chatId: string, isArchived: boolean) => {
    e.stopPropagation();
    onArchiveChat(chatId, !isArchived);
    setMenuOpen(null);
  };

  const handleShareClick = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    onShareChat(chatId);
    setMenuOpen(null);
  };

  const toggleMenu = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    setMenuOpen(menuOpen === chatId ? null : chatId);
  };

  React.useEffect(() => {
    const handleClickOutside = () => setMenuOpen(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <>
      {!isMobile && (
        <button
          onClick={onToggle}
          className="fixed top-20 left-0 z-30 p-2 bg-white dark:bg-gray-800 rounded-r-lg shadow-lg hidden md:block"
          aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isOpen ? <ChevronLeft /> : <ChevronRight />}
        </button>
      )}
      
      <div 
        className={`fixed inset-0 bg-black/50 z-20 transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onToggle}
      ></div>
      
      <div className={`fixed top-0 left-0 h-full z-30 transition-transform duration-300 transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="w-72 h-full bg-white dark:bg-gray-800 shadow-xl flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Chat History</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-[180px]">{user?.email}</p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={onNewChat}
                className="p-2 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
                aria-label="New chat"
              >
                <Plus className="w-5 h-5" />
              </button>
              {isMobile && (
                <button 
                  onClick={onToggle}
                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors md:hidden"
                  aria-label="Close sidebar"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {chatHistory && chatHistory.length > 0 ? (
              chatHistory.map((chat) => (
                <div
                  key={chat.id}
                  className={`w-full p-3 rounded-lg transition-colors group relative ${
                    currentChatId === chat.id
                      ? 'bg-purple-100 dark:bg-purple-900'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {editingTitle === chat.id ? (
                    <form onSubmit={(e) => handleRenameSubmit(e, chat.id)} className="flex gap-2">
                      <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className="flex-1 px-2 py-1 text-sm border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        autoFocus
                        onBlur={() => setEditingTitle(null)}
                      />
                      <button type="submit" className="text-sm text-purple-600 dark:text-purple-400">Save</button>
                    </form>
                  ) : (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => onSelectChat(chat.id, chat.messages)}
                        className="flex items-center gap-3 flex-1 text-left"
                      >
                        <MessageSquare className="w-5 h-5 text-purple-500 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                            {chat.title || 'Untitled Chat'}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {safeFormatDate(chat.timestamp)}
                          </p>
                        </div>
                      </button>
                      <button
                        onClick={(e) => toggleMenu(e, chat.id)}
                        className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        aria-label="Chat options"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                      
                      {menuOpen === chat.id && (
                        <div className="absolute right-0 top-full mt-1 w-48 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 z-50">
                          <div className="py-1" role="menu">
                            <button
                              onClick={(e) => handleRenameClick(e, chat.id, chat.title)}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                            >
                              <Edit2 className="w-4 h-4 mr-2" /> Rename
                            </button>
                            <button
                              onClick={(e) => handleShareClick(e, chat.id)}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                            >
                              <Share2 className="w-4 h-4 mr-2" /> Share
                            </button>
                            <button
                              onClick={(e) => handleArchiveClick(e, chat.id, !!chat.archived)}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                            >
                              <Archive className="w-4 h-4 mr-2" /> {chat.archived ? 'Unarchive' : 'Archive'}
                            </button>
                            <button
                              onClick={(e) => handleDeleteChat(e, chat.id)}
                              className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
                            >
                              <Trash2 className="w-4 h-4 mr-2" /> Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
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