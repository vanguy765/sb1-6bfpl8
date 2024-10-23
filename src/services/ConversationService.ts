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
    console.log('Handling conversation with params:', params);
    const { fromNumber, toNumber, agentType, message } = params;
    console.log('Fetching or creating user with phone number:', fromNumber);

    // Get or create user
    const [user] = await User.findOrCreate({
      where: { phoneNumber: fromNumber }
    });

    console.log('User fetched or created:', user);

    // Check cache for assistant
    console.log('Checking cache for assistant with phone number:', toNumber, 'and agent type:', agentType);
    const assistantCacheKey = `assistant:${toNumber}:${agentType}`;
    const { data: cachedAssistant, fromCache: assistantFromCache } = 
      await cacheService.get<Assistant>(assistantCacheKey);

    let assistant = cachedAssistant;
    if (!assistant) {
      [assistant] = await Assistant.findOrCreate({
        where: { phoneNumber: toNumber, agentType },
        defaults: { openaiAssistantId: 'default-id' }
      });
      await cacheService.set(assistantCacheKey, assistant);
    } else {
      console.log('Assistant found in cache:', assistant);
    } else {
      console.log('Thread found in cache:', thread);
    }

    console.log('Assistant fetched or created:', assistant);

    // Get or create thread
    console.log('Checking cache for thread with user ID:', user.id, 'and assistant ID:', assistant.id);
    const threadCacheKey = `thread:${user.id}:${assistant.id}`;
    const { data: cachedThread, fromCache: threadFromCache } = 
      await cacheService.get<Thread>(threadCacheKey);

    let thread = cachedThread;
    if (!thread) {
      [thread] = await Thread.findOrCreate({
        where: { userId: user.id, assistantId: assistant.id },
        defaults: { openaiThreadId: 'default-thread-id' }
      });
      await cacheService.set(threadCacheKey, thread);
    }

    console.log('Thread fetched or created:', thread);

    // Process message with OpenAI
    console.log('Processing message with OpenAI:', message);
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
