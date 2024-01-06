import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export const importDynamic = new Function('modulePath', 'return import(modulePath)');

@Injectable()
export class ChatgptService {
  chatGPTAPI: any;
  constructor(private readonly configureService: ConfigService) {}

  async init(openAIAPIKey: string) {
    const { ChatGPTAPI } = await importDynamic('chatgpt');
    this.chatGPTAPI = new ChatGPTAPI({
      apiKey: openAIAPIKey,
    });
    return this.chatGPTAPI;
  }

  async useHostApiKey() {}
}
