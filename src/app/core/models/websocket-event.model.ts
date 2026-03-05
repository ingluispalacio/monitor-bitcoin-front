import { EventType } from "../enums/event-type.enum";

export interface WebSocketEvent {
  type: EventType;
  orderId?: string;
  message?: string;
  data?: any;
}