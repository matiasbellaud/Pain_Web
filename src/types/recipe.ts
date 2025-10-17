export interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
}

export interface Recipe {
  name: string;
  description: string;
  servings: number;
  prep_time_minutes: number;
  cook_time_minutes: number;
  ingredients: Ingredient[];
  steps: string[];
}

export interface RecipeResponse {
  recipes: Recipe[];
  total_prep_time_minutes: number;
  total_cook_time_minutes: number;
  model: string;
  generated_at: string;
}
