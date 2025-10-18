import Anthropic from 'anthropic';
import fs from 'fs';

const apiKey = process.env.ANTHROPIC_API_KEY || '';
if (!apiKey) {
  // eslint-disable-next-line no-console
  console.warn('ANTHROPIC_API_KEY is not set');
}

export const anthropic = new Anthropic({ apiKey });

export function loadSystemPrompt(): string {
  const promptPath = process.env.SYSTEM_PROMPT_PATH;
  if (!promptPath) throw new Error('SYSTEM_PROMPT_PATH not configured');
  return fs.readFileSync(promptPath, 'utf8');
}


