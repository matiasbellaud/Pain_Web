import axios from 'axios';
import { RecipeResponse } from '@/types/recipe';

const OLLAMA_API_URL = '/api/ask';
const RECIPE_API_URL = '/api/recipe';
const DEFAULT_MODEL = 'llama3';

export interface OllamaMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface OllamaGenerateRequest {
  model: string;
  prompt: string;
  stream?: boolean;
  context?: number[];
}

export interface OllamaGenerateResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
  context?: number[];
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  prompt_eval_duration?: number;
  eval_count?: number;
  eval_duration?: number;
}

export interface RecipeRequest {
  ingredients: string[];
  number_of_recipes?: number;
  dietary_restrictions?: string;
}

export class OllamaService {
  private model: string;
  private context: number[] = [];

  constructor(model: string = DEFAULT_MODEL) {
    this.model = model;
  }

  async generate(prompt: string): Promise<string> {
    try {
      const requestBody: OllamaGenerateRequest = {
        model: this.model,
        prompt: prompt,
        stream: false,
        context: this.context.length > 0 ? this.context : undefined
      };

      console.log('🚀 Envoi de la requête à Ollama:', {
        url: OLLAMA_API_URL,
        model: this.model,
        promptLength: prompt.length
      });

      const response = await axios.post<OllamaGenerateResponse>(
        OLLAMA_API_URL,
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 60000
        }
      );

      console.log('✅ Réponse reçue de Ollama:', {
        responseLength: response.data.response.length,
        done: response.data.done
      });

      if (response.data.context) {
        this.context = response.data.context;
      }

      return response.data.response;
    } catch (error) {
      console.error('❌ Erreur lors de la communication avec Ollama:', error);

      if (axios.isAxiosError(error)) {
        console.error('Détails de l\'erreur:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          code: error.code
        });

        if (error.code === 'ECONNREFUSED') {
          throw new Error('Impossible de se connecter à Ollama. Assurez-vous que le serveur Ollama est démarré sur le port 4000.');
        }
        if (error.response?.status === 404) {
          throw new Error(`Le modèle "${this.model}" n'est pas disponible. Vérifiez qu'il est bien installé avec "ollama list". Réponse: ${JSON.stringify(error.response.data)}`);
        }
        if (error.response?.data) {
          throw new Error(`Erreur API Ollama (${error.response.status}): ${JSON.stringify(error.response.data)}`);
        }
        throw new Error(`Erreur API Ollama: ${error.message}`);
      }
      throw new Error('Une erreur inattendue s\'est produite lors de la communication avec Ollama.');
    }
  }

  async generateRecipes(ingredients: string[], numberOfRecipes: number = 1): Promise<RecipeResponse> {
    try {
      const requestBody: RecipeRequest = {
        ingredients,
        number_of_recipes: numberOfRecipes
      };

      console.log('🍳 Envoi de la requête de recettes:', {
        url: RECIPE_API_URL,
        ingredients,
        numberOfRecipes
      });

      const response = await axios.post<RecipeResponse>(
        RECIPE_API_URL,
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 90000
        }
      );

      console.log('✅ Recettes reçues:', {
        recipesCount: response.data.recipes.length
      });

      return response.data;
    } catch (error) {
      console.error('❌ Erreur lors de la génération de recettes:', error);

      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNREFUSED') {
          throw new Error('Impossible de se connecter au serveur de recettes. Assurez-vous que le serveur est démarré sur le port 4000.');
        }
        if (error.response?.data) {
          throw new Error(`Erreur API recettes (${error.response.status}): ${JSON.stringify(error.response.data)}`);
        }
        throw new Error(`Erreur API recettes: ${error.message}`);
      }
      throw new Error('Une erreur inattendue s\'est produite lors de la génération de recettes.');
    }
  }

  resetContext(): void {
    this.context = [];
  }

  setModel(model: string): void {
    this.model = model;
    this.resetContext();
  }

  getModel(): string {
    return this.model;
  }
}

export const ollamaService = new OllamaService();
