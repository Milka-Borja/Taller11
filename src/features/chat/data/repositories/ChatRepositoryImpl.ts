import { Message } from '../../domain/entities/Message';
import { ChatRepository } from '../../domain/repositories/ChatRepository';
import { GroqDataSource } from '../datasources/GroqDataSource';

export class ChatRepositoryImpl implements ChatRepository {
  private dataSource: GroqDataSource;

  constructor() {
    this.dataSource = new GroqDataSource();
  }

  async sendMessage(userMessage: string, history: Message[]): Promise<string> {
    return this.dataSource.generateResponse(userMessage, history);
  }
}