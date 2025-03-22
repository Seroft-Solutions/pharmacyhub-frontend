/**
 * Utility functions for payment approvals
 */

/**
 * Format currency with safeguards for invalid values
 */
export const formatCurrency = (amount: number | null | undefined) => {
  // Handle null, undefined, or NaN cases
  if (amount === null || amount === undefined || isNaN(amount)) {
    return 'N/A';
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Format date with safeguards
 */
export const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return 'N/A';
  
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
};

/**
 * Format transaction reference for display
 */
export const formatTransactionReference = (reference: string | null | undefined) => {
  if (!reference) return 'N/A';
  
  // If reference is longer than 12 characters, truncate with ellipsis
  if (reference.length > 12) {
    return `${reference.substring(0, 12)}...`;
  }
  
  return reference;
};

/**
 * Get user display name with fallbacks
 */
export const getUserDisplayName = (user: any) => {
  if (!user) return 'Unknown user';
  
  const firstName = user.firstName || '';
  const lastName = user.lastName || '';
  
  if (!firstName && !lastName) return user.email || 'Unknown user';
  
  return `${firstName} ${lastName}`.trim();
};

/**
 * Generate WhatsApp link for contacting user
 */
export const generateWhatsAppLink = (request: any) => {
  if (!request) return '#';
  
  const userName = getUserDisplayName(request.user);
  const examTitle = request.exam?.title || 'the exam';
  const amount = request.amount ? formatCurrency(request.amount) : 'the required amount';
  
  const message = encodeURIComponent(
    `Hi ${userName}, regarding your payment request #${request.id} for ${examTitle}. ` +
    `We need additional information about your payment of ${amount}. ` +
    `Please provide further details so we can process your request. Thank you!`
  );
  
  const userPhone = request.user?.phoneNumber || request.senderNumber || '';
  const phone = userPhone.replace(/[^0-9]/g, '');
  
  return `https://wa.me/${phone}?text=${message}`;
};

/**
 * Get status badge color based on payment status
 */
export const getStatusColor = (status: string) => {
  switch (status?.toUpperCase()) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    case 'APPROVED':
      return 'bg-green-100 text-green-800 border-green-300';
    case 'REJECTED':
      return 'bg-red-100 text-red-800 border-red-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

/**
 * Helper to determine if data is loading or has issues
 */
export const getDataState = (isLoading: boolean, isError: boolean, data: any[] | undefined) => {
  if (isLoading) return 'loading';
  if (isError) return 'error';
  if (!data || data.length === 0) return 'empty';
  return 'success';
};