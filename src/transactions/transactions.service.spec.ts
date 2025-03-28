import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { UsersService } from '../users/users.service';
import { WalletsService } from '../wallets/wallets.service';
import { getModelToken } from '@nestjs/mongoose';
import { Transaction } from './schemas/transaction.schema';
import { UserType } from '../users/schemas/user.schema';
import axios from 'axios';
import { BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose'; 

jest.mock('axios');

describe('TransactionsService', () => {
  let service: TransactionsService;
  let usersService: Partial<UsersService>;
  let walletsService: Partial<WalletsService>;
  let transactionModel: any;

  
  const payerId = new Types.ObjectId().toHexString();
  const payeeId = new Types.ObjectId().toHexString();

  beforeEach(async () => {
    usersService = {
      findById: jest.fn(),
    };

    walletsService = {
      findByUserId: jest.fn(),
      updateBalance: jest.fn(),
    };

    transactionModel = {
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        { provide: UsersService, useValue: usersService },
        { provide: WalletsService, useValue: walletsService },
        { provide: getModelToken(Transaction.name), useValue: transactionModel },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
  });

  it('deve lançar erro se o pagador for lojista', async () => {
    (usersService.findById as jest.Mock).mockImplementation((id) => {
      return {
        _id: id,
        type: UserType.MERCHANT,
      };
    });

    await expect(
      service.create({ payerId, payeeId, value: 50 }),
    ).rejects.toThrow(BadRequestException);
  });

  it('deve lançar erro se saldo for insuficiente', async () => {
    (usersService.findById as jest.Mock).mockResolvedValue({
      _id: payerId,
      type: UserType.COMMON,
    });

    
    (walletsService.findByUserId as jest.Mock).mockResolvedValueOnce({
      balance: 10,
    });

 
    (walletsService.findByUserId as jest.Mock).mockResolvedValueOnce({
      balance: 0,
    });

    await expect(
      service.create({ payerId, payeeId, value: 50 }),
    ).rejects.toThrow('Insufficient balance');
  });

  it('deve lançar erro se autorização externa falhar', async () => {
    (usersService.findById as jest.Mock).mockResolvedValue({
      _id: payerId,
      type: UserType.COMMON,
    });

    (walletsService.findByUserId as jest.Mock).mockResolvedValue({
      balance: 100,
    });

    
    (axios.get as jest.Mock).mockResolvedValue({
      data: {
        message: 'Não autorizado',
      },
    });

    await expect(
      service.create({ payerId, payeeId, value: 50 }),
    ).rejects.toThrow('Transaction not authorized by external service');
  });

  it('deve concluir uma transação com sucesso', async () => {
    (usersService.findById as jest.Mock).mockResolvedValue({
      _id: payerId,
      type: UserType.COMMON,
    });

    (walletsService.findByUserId as jest.Mock).mockResolvedValue({
      balance: 100,
    });

    
    (axios.get as jest.Mock).mockResolvedValue({
      data: {
        message: 'Autorizado',
      },
    });

    
    (axios.post as jest.Mock).mockResolvedValue({});

    
    (transactionModel.create as jest.Mock).mockResolvedValue({
      _id: 'tx1',
    });

    const result = await service.create({
      payerId,
      payeeId,
      value: 50,
    });

    expect(result).toEqual({ success: true, transactionId: 'tx1' });
  });
});
