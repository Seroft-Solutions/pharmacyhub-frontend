/**
 * Manual Payment Types
 */

/**
 * Enum for payment status
 */
export enum ManualPaymentStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

/**
 * Type for manual payment submission request
 */
export interface ManualPaymentSubmitRequest {
  examId: number;
  senderNumber: string;
  transactionId: string;
  notes?: string;
}

/**
 * Type for admin processing a request (approve/reject)
 */
export interface ManualPaymentProcessRequest {
  adminNotes?: string;
}

/**
 * Type for manual payment response from API
 */
export interface ManualPaymentResponseDTO {
  id: number;
  userId: string;
  examId: number;
  examTitle: string;
  senderNumber: string;
  transactionId: string;
  notes?: string;
  attachmentUrl?: string;
  status: string;
  createdAt: string;
  processedAt?: string;
  adminNotes?: string;
}