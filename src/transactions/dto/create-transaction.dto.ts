import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0.01)
  value: number; // Valor

  @IsNotEmpty()
  @IsNumber()
  payerId: string; // ID de quem paga

  @IsNotEmpty()
  @IsNumber()
  payeeId: string; // ID de quem recebe
}
