import React, { useState, useRef, useEffect } from 'react';
import { FiSend, FiCheck, FiCheckCircle, FiCornerUpLeft, FiX } from 'react-icons/fi';
import ChatHeader from './ChatHeader';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'store';
  timestamp: string;
  isRead: boolean;
  replyTo?: {
    id: string;
    text: string;
    sender: 'user' | 'store';
  };
}

interface ChatWindowProps {
  store: {
    id: string;
    name: string;
    logo: string;
    isVIP: boolean;
    isOnline: boolean;
    floor: string;
    unit: string;
  };
  messages: Message[];
  onSendMessage: (text: string, replyTo?: string) => void;
  onBack?: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ store, messages, onSendMessage, onBack }) => {
  const [newMessage, setNewMessage] = useState('');
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage, replyTo?.id);
      setNewMessage('');
      setReplyTo(null);
    }
  };

  return (
    <div className="flex flex-col h-full relative bg-primary-900">

      <ChatHeader storeName={store.name} onBack={onBack} />
      
      {/* پیام‌های ریپلای شده */}
      {replyTo && (
        <div className="p-2 bg-secondary-800/50 border-b border-secondary-700/50 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FiCornerUpLeft className="text-secondary-400 ml-2" />
              <span className="text-sm text-secondary-400">
                در پاسخ به: {replyTo.text}
              </span>
            </div>
            <button
              onClick={() => setReplyTo(null)}
              className="text-secondary-400 hover:text-white"
            >
              <FiX size={16} />
            </button>
          </div>
        </div>
      )}

      {/* لیست پیام‌ها */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.sender === 'user'
                  ? 'bg-gradient-to-r from-secondary-500 to-secondary-600 text-white'
                  : 'bg-secondary-800/50 backdrop-blur-sm text-white'
              }`}
            >
              {message.replyTo && (
                <div className="mb-2 p-2 bg-black/20 rounded-lg">
                  <div className="text-xs text-secondary-300">
                    در پاسخ به: {message.replyTo.text}
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm">{message.text}</span>
                <div className="flex items-center mr-2">
                  <span className="text-xs text-secondary-300 ml-2">
                    {message.timestamp}
                  </span>
                  {message.sender === 'user' && (
                    <div className="text-xs">
                      {message.isRead ? (
                        <FiCheckCircle className="text-secondary-300" />
                      ) : (
                        <FiCheck className="text-secondary-400" />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* ورودی پیام */}
      <div className="p-4 border-t border-primary-800/50 backdrop-blur-sm">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="پیام خود را بنویسید..."
            className="flex-grow bg-secondary-800/50 backdrop-blur-sm text-white rounded-full px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-secondary-500"
          />
          <button
            onClick={handleSendMessage}
            className="bg-gradient-to-r from-secondary-500 to-secondary-600 text-white rounded-full p-2 hover:from-secondary-600 hover:to-secondary-700 transition-all"
          >
            <FiSend size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow; 