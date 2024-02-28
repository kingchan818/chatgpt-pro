import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Transaction, TransactionSchema } from './schema/transaction.schema';
import { TransactionController } from './transaction.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Transaction.name, schema: TransactionSchema }]), AuthModule],
  providers: [TransactionService],
  exports: [TransactionService],
  controllers: [TransactionController],
})
export class TransactionModule {}
