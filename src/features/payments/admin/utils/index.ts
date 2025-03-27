/**
 * Utility functions for payment approvals
 */

interface User {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  username?: string;
}

interface ManualPaymentRequest {
  id: number;
  user: User;
  userId?: string;
  userEmail?: string; // Some responses might include this instead of user.email
  userFirstName?: string;
  userLastName?: string;
  userPhoneNumber?: string;
  exam?: {
    title: string;
    paperType?: string;
  };
  examTitle?: string; // Fallback if exam object is not present
  amount?: number;
  senderNumber?: string;
}

interface ArrayLike {
  length: number;
}

/**
 * Format currency with safeguards for invalid values
 */
export const formatCurrency = (amount: number | null | undefined) => {
  // Handle null, undefined, or NaN cases
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '0';
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Format date with safeguards and proper timezone handling
 */
export const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return 'N/A';
  
  try {
    // Create date object and format with timezone information
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'  // Adds timezone indicator (e.g., PKT)
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
 * Enhanced function to get user display name with multiple fallbacks
 */
export const getUserDisplayName = (request: ManualPaymentRequest | null | undefined) => {
  if (!request) return 'Unknown user';
  
  // Try the user object first
  if (request.user) {
    const firstName = request.user.firstName || '';
    const lastName = request.user.lastName || '';
    
    // Try first name + last name
    if (firstName || lastName) {
      return `${firstName} ${lastName}`.trim();
    }
    
    // Try username
    if (request.user.username) {
      return request.user.username;
    }
    
    // Try email from user object
    if (request.user.email) {
      return request.user.email.split('@')[0]; // Just the username part of email
    }
  }
  
  // Try enhanced backend properties
  if (request.userFirstName || request.userLastName) {
    return `${request.userFirstName || ''} ${request.userLastName || ''}`.trim();
  }
  
  // Try direct userEmail if it exists
  if (request.userEmail) {
    return request.userEmail.split('@')[0]; // Just the username part of email
  }
  
  // Try direct userId if it looks like an email
  if (request.userId && request.userId.includes('@')) {
    return request.userId.split('@')[0]; // Just the username part of email
  }
  
  // Try direct userId as fallback
  if (request.userId) {
    return `User ${request.userId}`;
  }
  
  return 'Unknown user';
};

/**
 * Enhanced function to get user email with fallbacks
 */
export const getUserEmail = (request: ManualPaymentRequest | null | undefined) => {
  if (!request) return 'No email';
  
  // Try email from user object
  if (request.user && request.user.email) {
    return request.user.email;
  }
  
  // Try direct userEmail property (from enhanced backend)
  if (request.userEmail) {
    return request.userEmail;
  }
  
  // Try to construct email from userId if it looks like an email
  if (request.userId && request.userId.includes('@')) {
    return request.userId;
  }
  
  return 'No email';
};

/**
 * Generate WhatsApp link for contacting user
 */
export const generateWhatsAppLink = (request: ManualPaymentRequest | null | undefined) => {
  if (!request) return '#';
  
  const userName = getUserDisplayName(request);
  const examTitle = request.exam?.title || request.examTitle || 'the exam';
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
export const getDataState = (
  isLoading: boolean, 
  isError: boolean, 
  data: ArrayLike | undefined
) => {
  if (isLoading) return 'loading';
  if (isError) return 'error';
  if (!data || data.length === 0) return 'empty';
  return 'success';
};