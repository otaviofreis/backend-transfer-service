import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0.01)
  value: number; 

  @IsNotEmpty()
  @IsNumber()
  payerId: string; 

  @IsNotEmpty()
  @IsNumber()
  payeeId: string; 
}
