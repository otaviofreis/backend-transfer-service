export enum UserType {
    COMMON = 'COMMON', // Comum
    MERCHANT = 'MERCHANT', // Lojista
  }
  
  export class User {
    id: number;
    fullName: string; // Nome completo
    email: string;
    cpfOrCnpj: string;
    password: string;
    type: UserType;
  }
  