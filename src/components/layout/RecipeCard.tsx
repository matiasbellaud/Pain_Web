import React, { useState } from 'react';

const RecipeCard = ({
  title = "Titre inconnu",
  time = "Temps inconnu",
  difficulty = "N/A",
  ingredients = [],
  steps = []
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="max-w-md mx-auto my-6 bg-white rounded-xl shadow-md border border-gray-200 transition-all duration-300"
    >
      <div
        className="flex justify-between items-start p-4 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div>
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <div className="text-sm text-gray-500 mt-1">
            ⏱ {time} &nbsp;•&nbsp; 🔥 {difficulty}
          </div>
        </div>
        <div
          className={`text-gray-600 transform transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        >
          ▼
        </div>
      </div>

      {isOpen && (
        <div className="px-4 pb-4">
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-700 mb-2">🧂 Ingrédients</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              {ingredients.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">👨‍🍳 Étapes</h3>
            <ol className="list-decimal list-inside text-gray-600 space-y-1">
              {steps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeCard;