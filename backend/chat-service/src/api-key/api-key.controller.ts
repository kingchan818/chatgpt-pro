import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { ApiKeyGuard } from './api-key.guard';
import { ApiKeyService } from './api-key.service';
import { Connection } from 'mongoose';
import { sessionTransaction } from 'src/utils/common';
import { InjectConnection } from '@nestjs/mongoose';

@Controller('api-key')
@UseGuards(ApiKeyGuard)
export class ApiKeyController {
  constructor(
    private readonly apiKeyService: ApiKeyService,
    @InjectConnection() private connection: Connection,
  ) {}
  @Get('total-usage')
  async getTotalUsage(@Req() req: any) {
    const result = await sessionTransaction(this.connection, async () => {
      return this.apiKeyService.findOne(req.currentUser.userApiKey);
    });

    return {
      count: result.usageCount,
      limit: result.usageLimit,
    };
  }
}
