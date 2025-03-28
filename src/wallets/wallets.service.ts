import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Wallet, WalletDocument } from './schemas/wallet.schema';

@Injectable()
export class WalletsService {
  constructor(
    @InjectModel(Wallet.name)
    private walletModel: Model<WalletDocument>,
  ) {}

  async create(userId: Types.ObjectId): Promise<Wallet> {
    const newWallet = new this.walletModel({ userId, balance: 0 });
    return newWallet.save();
  }

  async findByUserId(userId: Types.ObjectId): Promise<WalletDocument> {
    const userWallet = await this.walletModel.findOne({ userId }).exec();
    if (!userWallet) {
      throw new NotFoundException('Wallet not found');
    }
    return userWallet;
  }

  async updateBalance(userId: Types.ObjectId, newBalance: number): Promise<WalletDocument> {
    const wallet = await this.walletModel.findOneAndUpdate(
      { userId },
      { $set: { balance: newBalance } },
      { new: true }
    ).exec();
  
    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }
  
    return wallet;
  }
}
