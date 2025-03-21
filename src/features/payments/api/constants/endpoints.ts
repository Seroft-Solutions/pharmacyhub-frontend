/**
 * Payment API Endpoints Constants
 * 
 * This module defines all API endpoints for payment-related operations.
 * Using constants prevents typos and makes endpoint changes easier to manage.
 */

const BASE_URL = '/api/v1/payments';

/**
 * Payment API Endpoints
 */
export const PAYMENT_ENDPOINTS = {
  // Payment operations
  initiateExamPayment: `${BASE_URL}/exams/:examId/pay`,
  checkExamAccess: `${BASE_URL}/exams/:examId/access`,
  paymentHistory: `${BASE_URL}/history`,
  paymentDetails: `${BASE_URL}/details/:transactionId`,
  paymentCallback: `${BASE_URL}/callback`,
  
  // Premium exam info endpoints
  getPremiumExamInfo: `/api/v1/exams/:examId/premium-info`,
};

export default PAYMENT_ENDPOINTS;