import { OpenAI } from 'langchain/llms/openai';
import { User } from '../models/User.js';
import { Assistant } from '../models/Assistant.js';
import { Thread } from '../models/Thread.js';
import { cacheService } from './CacheService.js';

export class ConversationService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
    });
  }

  async handleConversation(params: {
    fromNumber: string;
    toNumber: string;
    agentType: string;
    message: string;
  }) {
    const { fromNumber, toNumber, agentType, message } = params;

    // Get or create user
    const [user] = await User.findOrCreate({
      where: { phoneNumber: fromNumber }
    });

    // Check cache for assistant
    const assistantCacheKey = `assistant:${toNumber}:${agentType}`;
    const { data: cachedAssistant, fromCache: assistantFromCache } = 
      await cacheService.get<Assistant>(assistantCacheKey);

    let assistant = cachedAssistant;
    if (!assistant) {
      [assistant] = await Assistant.findOrCreate({
        where: { phoneNumber: toNumber, agentType }
      });
      await cacheService.set(assistantCacheKey, assistant);
    }

    // Get or create thread
    const threadCacheKey = `thread:${user.id}:${assistant.id}`;
    const { data: cachedThread, fromCache: threadFromCache } = 
      await cacheService.get<Thread>(threadCacheKey);

    let thread = cachedThread;
    if (!thread) {
      [thread] = await Thread.findOrCreate({
        where: { userId: user.id, assistantId: assistant.id }
      });
      await cacheService.set(threadCacheKey, thread);
    }

    // Process message with OpenAI
    const response = await this.openai.call(message);

    return {
      response,
      metadata: {
        assistantFromCache,
        threadFromCache
      }
    };
  }
}