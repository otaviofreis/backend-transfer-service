export class Transaction {
  id: number;
  value: number; // Valor
  payerId: number; // ID de quem paga
  payeeId: number; // ID de quem recebe
  createdAt: Date;
}
