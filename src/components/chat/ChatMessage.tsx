import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Bot, User } from 'lucide-react';
import RecipeCard from '@/components/layout/RecipeCard';
import { Recipe } from '@/types/recipe';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  recipes?: Recipe[];
}

export default function ChatMessage({ role, content, recipes }: ChatMessageProps) {
  const isUser = role === 'user';

  return (
    <div
      className={cn(
        'flex gap-4 p-4 group transition-all',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback className={cn(
          isUser
            ? 'bg-primary text-primary-foreground shadow-lg'
            : 'bg-gradient-to-br from-purple-500 to-blue-500 text-white shadow-lg'
        )}>
          {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>
      <div className={cn(
        'flex-1 space-y-2 max-w-[75%]',
        isUser ? 'items-end' : 'items-start'
      )}>
        <div className={cn(
          'font-semibold text-xs opacity-70',
          isUser ? 'text-right' : 'text-left'
        )}>
          {isUser ? 'Vous' : 'Assistant'}
        </div>
        <div className={cn(
          'rounded-2xl px-4 py-3 shadow-sm transition-all hover:shadow-md',
          isUser
            ? 'bg-primary text-primary-foreground rounded-tr-sm'
            : 'bg-muted/80 backdrop-blur-sm border border-border/50 rounded-tl-sm'
        )}>
          <div className="text-sm leading-relaxed whitespace-pre-wrap">
            {content}
          </div>
        </div>
        {recipes && recipes.length > 0 && (
          <div className="mt-4 space-y-4 w-full">
            {recipes.map((recipe, index) => {
              const totalTime = recipe.prep_time_minutes + recipe.cook_time_minutes;
              const ingredientsList = recipe.ingredients.map(
                ing => `${ing.quantity} ${ing.unit} ${ing.name}`
              );

              return (
                <RecipeCard
                  key={index}
                  title={recipe.name}
                  time={`${totalTime} min (préparation: ${recipe.prep_time_minutes} min, cuisson: ${recipe.cook_time_minutes} min)`}
                  difficulty={`${recipe.servings} portion${recipe.servings > 1 ? 's' : ''}`}
                  ingredients={ingredientsList}
                  steps={recipe.steps}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
