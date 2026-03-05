export enum OrderStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED'
}

export const OrderStatusLabels: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: 'Pendiente',
  [OrderStatus.APPROVED]: 'Aprobada',
  [OrderStatus.REJECTED]: 'Rechazada',
  [OrderStatus.CANCELLED]: 'Cancelada',
  [OrderStatus.COMPLETED]: 'Completada'
};

export const OrderStatusColors: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
  [OrderStatus.APPROVED]: 'bg-green-100 text-green-800',
  [OrderStatus.REJECTED]: 'bg-red-100 text-red-800',
  [OrderStatus.CANCELLED]: 'bg-gray-100 text-gray-800',
  [OrderStatus.COMPLETED]: 'bg-blue-100 text-blue-800'
};