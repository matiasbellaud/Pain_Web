import React, { useState, useEffect, useRef } from 'react';
import Layout from "@/components/layout/Layout";
import ChatMessage from '@/components/chat/ChatMessage';
import ChatInput from '@/components/chat/ChatInput';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

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
      <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
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
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 px-4">
          <div ref={scrollRef} className="space-y-1">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                role={message.role}
                content={message.content}
              />
            ))}
            {isTyping && (
              <ChatMessage
                role="assistant"
                content="En train d'écrire..."
              />
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="border-t p-4 bg-background">
          <ChatInput
            onSendMessage={handleSendMessage}
            disabled={isTyping}
          />
        </div>
      </div>
    </Layout>
  );
}
