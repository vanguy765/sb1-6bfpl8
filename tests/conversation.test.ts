import { describe, it, expect, beforeEach } from 'vitest';
import { ConversationService } from '../src/services/ConversationService.js';
import { sequelize } from '../src/config/database.js';
import { User } from '../src/models/User.js';
import { Assistant } from '../src/models/Assistant.js';
import { Thread } from '../src/models/Thread.js';

describe('ConversationService', () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  it('should create new user, assistant and thread', async () => {
    const service = new ConversationService();
    const result = await service.handleConversation({
      fromNumber: '+1234567890',
      toNumber: '+0987654321',
      agentType: 'support',
      message: 'Hello',
      openaiAssistantId: 'mock-id-123'
    });

    const user = await User.findOne({ where: { phoneNumber: '+1234567890' } });
    const assistant = await Assistant.findOne({ 
      where: { 
        phoneNumber: '+0987654321',
        agentType: 'support'
      } 
    });

    expect(user).toBeTruthy();
    expect(assistant).toBeTruthy();
    expect(result.response).toBeTruthy();
  });

  it('should use cached data for existing entities', async () => {
    const service = new ConversationService();
    
    // First call to create entities
    await service.handleConversation({
      fromNumber: '+1234567890',
      toNumber: '+0987654321',
      agentType: 'support',
      message: 'Hello'
    });

    // Second call should use cache
    const result = await service.handleConversation({
      fromNumber: '+1234567890',
      toNumber: '+0987654321',
      agentType: 'support',
      message: 'Follow up',
      openaiAssistantId: 'mock-id-123'
    });

    expect(result.metadata.assistantFromCache).toBe(true);
    expect(result.metadata.threadFromCache).toBe(true);
  });
});
