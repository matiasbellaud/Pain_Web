import React, { useState, useEffect, useRef } from 'react';
import Layout from "@/components/layout/Layout";
import ChatMessage from '@/components/chat/ChatMessage';
import ChatInput from '@/components/chat/ChatInput';
import MetricsWidget from '@/components/MetricsWidget';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Trash2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ollamaService } from '@/services/ollama';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>();
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll vers le bas quand un nouveau message arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content
    };

    setMessages(prev => [userMessage]);
    setIsTyping(true);
    setError(null);

    try {
      // Envoyer le message à Ollama
      const response = await ollamaService.generate(content);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response
      };

      setMessages(prev => [assistantMessage]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur inconnue s\'est produite';
      setError(errorMessage);

      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `❌ Erreur : ${errorMessage}`
      };

      setMessages(prev => [errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: 'Bonjour ! Je suis votre assistant culinaire propulsé par Ollama. Posez-moi vos questions sur les recettes, les techniques de cuisine, ou demandez-moi des idées de repas !'
      }
    ]);
    setError(null);
    ollamaService.resetContext();
  };

  return (
    <Layout>
      <MetricsWidget />
      <motion.div
        className="flex flex-col h-[calc(100vh-4rem)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Error Banner */}
        {error && (
          <motion.div
            className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 flex items-center gap-2"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </motion.div>
        )}

        {/* Messages */}
        <ScrollArea className="flex-1 px-4 max-w-4xl mx-auto">
          <div ref={scrollRef} className="space-y-1">
            <AnimatePresence initial={false}>
              {messages?.map((message) => (
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
          className=""
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
