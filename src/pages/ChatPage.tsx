import React, { useState, useEffect, useRef } from 'react';
import Layout from "@/components/layout/Layout";
import ChatMessage from '@/components/chat/ChatMessage';
import ChatInput from '@/components/chat/ChatInput';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll vers le bas quand un nouveau message arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Simuler une réponse de l'assistant
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Vous avez dit : "${content}"\n\nC'est une simulation de réponse. Pour intégrer une vraie IA, vous pouvez utiliser l'API d'OpenAI, Anthropic Claude, ou tout autre service de chatbot.`
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?'
      }
    ]);
  };

  return (
    <Layout>
      <motion.div
        className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <motion.div
          className="flex items-center justify-between p-4 border-b"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <h1 className="text-2xl font-bold">Chat Assistant</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearChat}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Effacer
          </Button>
        </motion.div>

        {/* Messages */}
        <ScrollArea className="flex-1 px-4">
          <div ref={scrollRef} className="space-y-1">
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.3,
                    ease: [0.4, 0, 0.2, 1]
                  }}
                >
                  <ChatMessage
                    role={message.role}
                    content={message.content}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChatMessage
                  role="assistant"
                  content="En train d'écrire..."
                />
              </motion.div>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <motion.div
          className="border-t p-4 bg-background"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <ChatInput
            onSendMessage={handleSendMessage}
            disabled={isTyping}
          />
        </motion.div>
      </motion.div>
    </Layout>
  );
}
