import { OrderStatus } from "../enums/order-status.enum";
export interface Order {
  id: string;
  clientName: string;
  cryptoName: string;
  amount: number;
  price: number;
  total: number;
  status: OrderStatus;
  createdAt: Date;
}