export interface ArtPiece {
  id: string;
  imageUrl: string;
  title: string;
  prompt: string;
  negativePrompt?: string;
  model: string;
  tags: string[];
  author: string;
  likes: number;
}

export enum NavTab {
  EXPLORE = 'EXPLORE',
  PROMPT_BUILDER = 'PROMPT_BUILDER',
  CREATE_ART = 'CREATE_ART'
}

export interface PromptResponse {
  enhancedPrompt: string;
  negativePrompt: string;
  suggestedModel: string;
}
