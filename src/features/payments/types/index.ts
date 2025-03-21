/**
 * Payment system types
 */

export enum PaymentMethod {
  CREDIT_CARD = 'CREDIT_CARD',
  EASYPAISA = 'EASYPAISA',
  JAZZCASH = 'JAZZCASH',
  BANK_TRANSFER = 'BANK_TRANSFER'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  EXPIRED = 'EXPIRED'
}

export interface PaymentDTO {
  id: number;
  amount: number;
  status: string;
  method: string;
  createdAt: string;
  completedAt?: string;
  itemType: string;
  itemId: number;
  itemName?: string;
}

export interface PaymentInitRequest {
  paymentMethod: PaymentMethod;
}

export interface PaymentInitResponse {
  paymentId: number;
  transactionId: string;
  redirectUrl: string;
  formParameters: Record<string, string>;
}

export interface PaymentDetails {
  paymentId: number;
  amount: number;
  currency: string;
  transactionId: string;
  gatewayUrl: string;
  formParameters: Record<string, string>;
  itemName: string;
}

export interface PaymentResult {
  success: boolean;
  message: string;
}

export interface PremiumExamInfoDTO {
  examId: number;
  premium: boolean;
  price: number;
  purchased: boolean;
}
