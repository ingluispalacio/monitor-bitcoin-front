import { OrderStatus } from "../../../../core/enums/order-status.enum";

export interface OrderFilter {
  status?: OrderStatus;
  startDate?: Date;
  endDate?: Date;
  clientName?: string;
}