import { buildSystemPrompt } from './src/lib/prompts';

const prompt = buildSystemPrompt({ actionProtocol: 'webdroid_json' });
console.log(prompt);
