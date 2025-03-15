import React from 'react';
import { MessageCircle, Bot } from 'lucide-react';
import type { ChatMessage as ChatMessageType } from '../data/chatData';

interface ChatMessageProps {
  message: ChatMessageType;
  isTyping?: boolean;
  isDark?: boolean;
}

export function ChatMessage({ message, isTyping = false, isDark = false }: ChatMessageProps) {
  return (
    <div 
      className={`flex gap-2 md:gap-4 ${message.isBot ? 'flex-row' : 'flex-row-reverse'} 
        animate-fade-in`}
    >
      <div 
        className={`w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center flex-shrink-0
          ${message.isBot 
            ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500' 
            : 'bg-gradient-to-r from-emerald-400 to-cyan-400'}`}
      >
        {message.isBot ? (
          <Bot className="w-5 h-5 md:w-6 md:h-6 text-white" />
        ) : (
          <MessageCircle className="w-5 h-5 md:w-6 md:h-6 text-white" />
        )}
      </div>
      <div 
        className={`max-w-[85%] px-4 py-3 md:px-6 md:py-4 rounded-2xl shadow-sm text-sm md:text-base
          ${message.isBot 
            ? 'bg-white/80 dark:bg-gray-800/80 backdrop-blur border border-gray-100 dark:border-gray-700' 
            : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white'}`}
      >
        <p className={`${message.isBot ? 'text-gray-800 dark:text-gray-200' : 'text-white'} leading-relaxed`}>
          {message.text}
          {isTyping && (
            <span className="typing-animation">
              <span>.</span><span>.</span><span>.</span>
            </span>
          )}
        </p>
        <span className={`text-xs mt-2 block ${message.isBot ? 'text-gray-400 dark:text-gray-500' : 'text-white/75'}`}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
}