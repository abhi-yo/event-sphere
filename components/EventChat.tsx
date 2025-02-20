"use client";

import { Send } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useSocket } from '../contexts/SocketContext';

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  text: string;
  userId: string;
  timestamp: number;
}

interface EventChatProps {
  eventId: string;
}

const MESSAGE_EXPIRATION_TIME = 30 * 1000;

const EventChat: React.FC<EventChatProps> = ({ eventId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [userId] = useState(uuidv4());
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { socket, isConnected } = useSocket();

  const fetchPastMessages = useCallback(async () => {
    try {
      const response = await fetch(`/api/messages/${eventId}`);
      if (response.ok) {
        const pastMessages: Message[] = await response.json();
        setMessages(pastMessages);
      } else {
        console.error('Failed to fetch past messages');
      }
    } catch (error) {
      console.error('Error fetching past messages:', error);
    }
  }, [eventId]);

  useEffect(() => {
    fetchPastMessages();
  }, [fetchPastMessages]);

  useEffect(() => {
    if (socket && isConnected) {
      socket.emit('join', eventId);
      const handleMessage = (message: Message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      };
      socket.on('message', handleMessage);
      return () => {
        socket.off('message', handleMessage);
        socket.emit('leave', eventId);
      };
    }
  }, [socket, isConnected, eventId]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const checkMessageExpiration = () => {
      const currentTime = Date.now();
      setMessages((prevMessages) =>
        prevMessages.filter((message) => currentTime - message.timestamp < MESSAGE_EXPIRATION_TIME)
      );
    };

    const intervalId = setInterval(checkMessageExpiration, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() && socket && isConnected) {
      const message: Message = {
        id: uuidv4(),
        text: inputMessage,
        userId,
        timestamp: Date.now(),
      };
      socket.emit('message', { eventId, message });
      setInputMessage('');
    }
  };

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-50"></div>
        <span className="ml-2">Connecting to chat...</span>
      </div>
    );
  }

  return (
    <div className="mx-4 mt-8">
      <div className="bg-white rounded-3xl shadow-lg flex flex-col h-[500px]">
        <ScrollArea 
          className="flex-1 px-6" 
          ref={chatContainerRef}
        >
          <div className="py-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.userId === userId ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex ${message.userId === userId ? 'flex-row-reverse' : 'flex-row'} items-end max-w-[70%] gap-2`}>
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-purple-50 text-gray-700">
                      {message.userId.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`p-3 rounded-xl ${
                    message.userId === userId ? 'bg-purple-50 text-gray-700' : 'bg-gray-100 text-gray-800'
                  }`}>
                    <p className="text-sm">{message.text}</p>
                    <span className={`text-xs ${message.userId === userId ? 'text-gray-500' : 'text-gray-500'}`}>
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <div className="p-6 border-t">
          <form onSubmit={sendMessage} className="flex space-x-2">
            <Input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 rounded-full focus:ring-purple-50 focus:border-purple-50"
              placeholder="Type a message..."
            />
            <Button 
              type="submit" 
              disabled={!isConnected}
              className="rounded-full bg-purple-50 hover:bg-purple-100 text-gray-700"
            >
              <Send className="w-4 h-4 mr-2" />
              Send
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventChat;