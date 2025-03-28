export enum UserType {
    COMMON = 'COMMON', 
    MERCHANT = 'MERCHANT', 
  }
  
  export class User {
    id: number;
    fullName: string; 
    email: string;
    cpfOrCnpj: string;
    password: string;
    type: UserType;
  }
  