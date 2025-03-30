/**
 * Payment Service
 * 
 * This service provides methods for interacting with the payment-related API endpoints.
 */

import { apiClient } from '@/core/api';
import { API_ENDPOINTS } from '../constants';

/**
 * Service for payment-related API calls
 */
export const paymentService = {
  /**
   * Get payment status for a specific exam
   */
  async getPaymentStatus(examId: number) {
    const { data } = await apiClient.get(API_ENDPOINTS.PAYMENT_STATUS(examId));
    return data;
  },
  
  /**
   * Initiate a payment checkout
   */
  async initiateCheckout(examId: number) {
    const { data } = await apiClient.post(API_ENDPOINTS.PAYMENT_CHECKOUT(examId));
    return data;
  },
  
  /**
   * Check if user has universal access
   */
  async checkUniversalAccess(): Promise<boolean> {
    try {
      const { data } = await apiClient.get(`${API_ENDPOINTS.PAYMENTS}/universal-access`);
      return data.hasUniversalAccess || false;
    } catch (error) {
      console.error('Error checking universal access:', error);
      return false;
    }
  },
  
  /**
   * Get all purchased exams
   */
  async getPurchasedExams(): Promise<number[]> {
    try {
      const { data } = await apiClient.get(`${API_ENDPOINTS.PAYMENTS}/purchased`);
      return data.examIds || [];
    } catch (error) {
      console.error('Error fetching purchased exams:', error);
      return [];
    }
  },
  
  /**
   * Verify a payment by ID
   */
  async verifyPayment(paymentId: string) {
    const { data } = await apiClient.get(`${API_ENDPOINTS.PAYMENTS}/${paymentId}/verify`);
    return data;
  },
};
