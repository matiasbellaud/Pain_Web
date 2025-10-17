import React, { useState, useEffect, useRef } from 'react';
import Layout from "@/components/layout/Layout";
import ChatMessage from '@/components/chat/ChatMessage';
import ChatInput from '@/components/chat/ChatInput';
import MetricsWidget from '@/components/MetricsWidget';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ollamaService } from '@/services/ollama';
import { Recipe } from '@/types/recipe';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  recipes?: Recipe[];
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>();
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const extractIngredients = (message: string): string[] => {
    const commonIngredients = [
      'oeuf', 'oeufs', 'jambon', 'fromage', 'lait', 'beurre', 'farine', 'sucre',
      'tomate', 'tomates', 'oignon', 'oignons', 'ail', 'poulet', 'viande',
      'poisson', 'pâtes', 'riz', 'pain', 'salade', 'carotte', 'carottes',
      'pomme de terre', 'pommes de terre', 'courgette', 'courgettes',
      'poivron', 'poivrons', 'champignon', 'champignons', 'pâte', 'pasta'
    ];

    const messageLower = message.toLowerCase();
    const foundIngredients: string[] = [];

    for (const ingredient of commonIngredients) {
      if (messageLower.includes(ingredient)) {
        foundIngredients.push(ingredient);
      }
    }

    return foundIngredients;
  };

  const isRecipeRequest = (message: string): boolean => {
    const recipeKeywords = [
      'recette', 'cuisiner', 'préparer', 'faire', 'j\'ai',
      'avec', 'ingrédient', 'plat', 'repas', 'manger'
    ];

    const messageLower = message.toLowerCase();
    return recipeKeywords.some(keyword => messageLower.includes(keyword));
  };

  const parseRecipeResponse = (response: string): { content: string; recipes?: Recipe[] } => {
    try {
      const jsonMatch = response.match(/\{[\s\S]*"recipes"[\s\S]*\}/);
      if (jsonMatch) {
        const jsonStr = jsonMatch[0];
        const recipeData = JSON.parse(jsonStr);

        if (recipeData.recipes && Array.isArray(recipeData.recipes)) {
          const textContent = response.replace(jsonStr, '').trim();
          const displayContent = textContent || 'Voici les recettes que j\'ai trouvées pour vous :';

          return {
            content: displayContent,
            recipes: recipeData.recipes
          };
        }
      }
    } catch (e) {
      console.log('No recipe JSON found in response');
    }

    return { content: response };
  };

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
      const shouldUseRecipeAPI = isRecipeRequest(content);
      const ingredients = shouldUseRecipeAPI ? extractIngredients(content) : [];

      if (shouldUseRecipeAPI && ingredients.length > 0) {
        const recipeResponse = await ollamaService.generateRecipes(ingredients, 3);

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `Voici ${recipeResponse.recipes.length} recette${recipeResponse.recipes.length > 1 ? 's' : ''} que vous pouvez préparer avec ${ingredients.join(', ')} :`,
          recipes: recipeResponse.recipes
        };

        setMessages(prev => [assistantMessage]);
      } else {
        const response = await ollamaService.generate(content);
        const parsedResponse = parseRecipeResponse(response);

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: parsedResponse.content,
          recipes: parsedResponse.recipes
        };

        setMessages(prev => [assistantMessage]);
      }
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


  return (
    <Layout>
      <MetricsWidget />
      <motion.div
        className="flex flex-col h-[calc(100vh-4rem)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
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
                    recipes={message.recipes}
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
