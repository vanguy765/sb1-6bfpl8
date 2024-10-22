import { Request, Response } from 'express';
import { ConversationService } from '../services/ConversationService.js';
import { z } from 'zod';

const conversationService = new ConversationService();

const ConversationSchema = z.object({
  fromNumber: z.string(),
  toNumber: z.string(),
  agentType: z.string(),
  message: z.string()
});

export class ConversationController {
  async createConversation(req: Request, res: Response) {
    try {
      const validation = ConversationSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({
          error: 'Invalid request parameters',
          details: validation.error
        });
      }

      const result = await conversationService.handleConversation(validation.data);
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}