import { MessageCircle, Bot } from "lucide-react";
import type { ChatMessage as ChatMessageType } from "../data/chatData";

interface ChatMessageProps {
  message: ChatMessageType;
  isTyping?: boolean;
  isDark?: boolean;
}

export function ChatMessage({
  message,
  isTyping = false,
  isDark = false,
}: ChatMessageProps) {
  return (
    <div
      className={`flex gap-4 ${message.isBot ? "flex-row" : "flex-row-reverse"} 
        animate-fade-in sm:flex-col sm:items-start`}
    >
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center 
          ${
            message.isBot
              ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
              : "bg-gradient-to-r from-emerald-400 to-cyan-400"
          }`}
      >
        {message.isBot ? (
          <Bot className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
      </div>
      <div
        className={`max-w-[85%] sm:max-w-full px-6 py-4 rounded-2xl shadow-sm
          ${
            message.isBot
              ? `bg-white/80 ${
                  isDark ? "dark:bg-gray-800/80" : ""
                } backdrop-blur border border-gray-100 ${
                  isDark ? "dark:border-gray-700" : ""
                }`
              : "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white"
          }`}
      >
        <p
          className={`${
            message.isBot
              ? `text-gray-800 ${isDark ? "dark:text-gray-200" : ""}`
              : "text-white"
          } leading-relaxed`}
        >
          {message.text}
          {isTyping && (
            <span className="typing-animation">
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </span>
          )}
        </p>
        <span
          className={`text-xs mt-2 block ${
            message.isBot
              ? `text-gray-400 ${isDark ? "dark:text-gray-500" : ""}`
              : "text-white/75"
          }`}
        >
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
}
