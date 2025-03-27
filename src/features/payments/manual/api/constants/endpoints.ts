/**
 * Manual Payment API Endpoints Constants
 * 
 * This module defines all API endpoints for manual payment-related operations.
 */

const BASE_URL = '/api/v1/payments/manual';

/**
 * Manual Payment API Endpoints
 */
export const MANUAL_PAYMENT_ENDPOINTS = {
  // User endpoints
  submitRequest: `${BASE_URL}/request`,
  getUserRequests: `${BASE_URL}/requests`,
  checkExamAccess: `${BASE_URL}/exams/:examId/access`,
  checkPendingRequest: `${BASE_URL}/exams/:examId/pending`,
  
  // Admin endpoints
  getAllRequests: `${BASE_URL}/admin/requests`,
  getRequestsByStatus: `${BASE_URL}/admin/requests/status/:status`,
  approveRequest: `${BASE_URL}/admin/requests/:requestId/approve`,
  rejectRequest: `${BASE_URL}/admin/requests/:requestId/reject`,
  
  // Statistics and history endpoints
  getStatistics: `${BASE_URL}/admin/statistics`,
  getHistorySummary: `${BASE_URL}/admin/history/summary`,
  getPaymentHistory: `${BASE_URL}/admin/history`,
  getPaymentHistoryByStatus: `${BASE_URL}/admin/history/status/:status`,
};

export default MANUAL_PAYMENT_ENDPOINTS;