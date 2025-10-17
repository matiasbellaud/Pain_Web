import React, { useState } from 'react';

interface RecipeCardProps {
  title?: string;
  time?: string;
  difficulty?: string;
  ingredients?: string[];
  steps?: string[];
}

const RecipeCard = ({
  title = "Titre inconnu",
  time = "Temps inconnu",
  difficulty = "N/A",
  ingredients = [],
  steps = []
}: RecipeCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="max-w-full my-3 bg-card/50 backdrop-blur-sm rounded-2xl shadow-sm border border-border/50 transition-all duration-300 hover:shadow-md overflow-hidden"
    >
      <div
        className="flex justify-between items-start p-4 cursor-pointer hover:bg-muted/30 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-foreground mb-2">{title}</h2>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="text-base">⏱</span>
              {time}
            </span>
            <span className="flex items-center gap-1">
              <span className="text-base">🔥</span>
              {difficulty}
            </span>
          </div>
        </div>
        <div
          className={`text-muted-foreground transform transition-transform duration-300 ml-2 ${
            isOpen ? 'rotate-180' : ''
          }`}
        >
          ▼
        </div>
      </div>

      {isOpen && (
        <div className="px-4 pb-4 border-t border-border/30">
          <div className="pt-4 mb-4">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <span className="text-base">🧂</span>
              Ingrédients
            </h3>
            <ul className="space-y-2">
              {ingredients.map((item, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <span className="text-base">👨‍🍳</span>
              Étapes
            </h3>
            <ol className="space-y-3">
              {steps.map((step, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold">
                    {index + 1}
                  </span>
                  <span className="flex-1 pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeCard;