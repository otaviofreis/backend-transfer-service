import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import axios from 'axios';

import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction, TransactionDocument } from './schemas/transaction.schema';
import { UsersService } from 'src/users/users.service';
import { WalletsService } from 'src/wallets/wallets.service';
import { UserType } from 'src/users/schemas/user.schema';

interface AuthorizationResponse {
  message: string;
}

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<TransactionDocument>,
    private readonly usersService: UsersService,
    private readonly walletsService: WalletsService,
  ) {}

  async create(dto: CreateTransactionDto): Promise<any> {
    try {
      const { payerId, payeeId, value } = dto;

     
      const payer = await this.usersService.findById(payerId);
      const payee = await this.usersService.findById(payeeId);

      if (!payer || !payee) {
        throw new BadRequestException('User not found');
      }

      
      if (payer.type !== UserType.COMMON) {
        throw new BadRequestException('Merchants cannot send money');
      }

      
      const payerWallet = await this.walletsService.findByUserId(
        payer._id as Types.ObjectId,
      );
      const payeeWallet = await this.walletsService.findByUserId(
        payee._id as Types.ObjectId,
      );

      if (!payerWallet || !payeeWallet) {
        throw new BadRequestException('Wallet not found');
      }

      
      if (payerWallet.balance < value) {
        throw new BadRequestException('Insufficient balance');
      }

      
      const authResponse = await axios.get<AuthorizationResponse>(
        'https://util.devi.tools/api/v2/authorize',
      );
      console.log('Authorization response:', authResponse.data);

      if (authResponse.data.message !== 'Autorizado') {
        throw new BadRequestException(
          'Transaction not authorized by external service',
        );
      }

      
      await this.walletsService.updateBalance(
        payer._id as Types.ObjectId,
        payerWallet.balance - value,
      );
      await this.walletsService.updateBalance(
        payee._id as Types.ObjectId,
        payeeWallet.balance + value,
      );

      
      const transaction = await this.transactionModel.create({
        value,
        payerId: new Types.ObjectId(payer._id as Types.ObjectId),
        payeeId: new Types.ObjectId(payee._id as Types.ObjectId),
      });

      
      const payeeIdAsString = String(payee._id); 


      await axios.post('https://util.devi.tools/api/v1/notify', {
        userId: payeeIdAsString,
        message: 'You received a transfer!',
      });

      
      return {
        success: true,
        transactionId: transaction._id,
      };
    } catch (error) {
      console.error('Transaction error:', error);
    
      if (error instanceof BadRequestException) {
        throw error;
      }
    
      throw new BadRequestException('Internal error during transaction');
    }
  }
}
