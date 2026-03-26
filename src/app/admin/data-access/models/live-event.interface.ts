export interface LiveEvent {
  type: 'ORDER_CREATED' | 'ORDER_APPROVED' | 'ORDER_REJECTED';
  clientName: string;
  amount: number;
  status: string;
  timestamp: Date;
}