/**
 * Error Message Constants
 *
 * Single source of truth for all error messages used throughout the application.
 * Ensures consistency and makes it easier to update messages globally.
 */

// ============================================================================
// Authentication & Authorization Errors
// ============================================================================

export const ERROR_MESSAGES = {
  // Authentication
  UNAUTHORIZED: 'Unauthorized',
  FORBIDDEN: 'Forbidden',
  AUTH_REQUIRED: 'Authentication required',
  INVALID_CREDENTIALS: 'Invalid credentials',
  SESSION_EXPIRED: 'Your session has expired. Please sign in again.',
  
  // Authorization
  ADMIN_REQUIRED: 'Admin access required',
  TEAM_ACCESS_REQUIRED: 'Team access required',
  CUSTOMER_ACCESS_REQUIRED: 'Customer access required',
  PERMISSION_DENIED: 'You do not have permission to perform this action',
  
  // Not Found
  NOT_FOUND: 'Not Found',
  RESOURCE_NOT_FOUND: (resource: string) => `${resource} not found`,
  CUSTOMER_NOT_FOUND: 'Customer not found',
  WEBSITE_NOT_FOUND: 'Website not found',
  LEAD_NOT_FOUND: 'Lead not found',
  INVOICE_NOT_FOUND: 'Invoice not found',
  TICKET_NOT_FOUND: 'Support ticket not found',
  
  // Validation
  INVALID_INPUT: 'Invalid input provided',
  INVALID_ID: 'Invalid ID format',
  INVALID_EMAIL: 'Invalid email format',
  INVALID_DOMAIN: 'Invalid domain format',
  INVALID_UUID: 'Invalid UUID format',
  REQUIRED_FIELD: (field: string) => `${field} is required`,
  FIELD_TOO_SHORT: (field: string, min: number) => `${field} must be at least ${min} characters`,
  FIELD_TOO_LONG: (field: string, max: number) => `${field} must be no more than ${max} characters`,
  
  // API Errors
  FAILED_TO_FETCH: (resource: string) => `Failed to fetch ${resource}`,
  FAILED_TO_CREATE: (resource: string) => `Failed to create ${resource}`,
  FAILED_TO_UPDATE: (resource: string) => `Failed to update ${resource}`,
  FAILED_TO_DELETE: (resource: string) => `Failed to delete ${resource}`,
  FAILED_TO_SEARCH: (resource: string) => `Failed to search ${resource}`,
  
  // Rate Limiting
  RATE_LIMIT_EXCEEDED: 'Rate limit exceeded. Please try again later.',
  TOO_MANY_REQUESTS: 'Too many requests. Please slow down.',
  
  // Server Errors
  INTERNAL_ERROR: 'An internal error occurred. Please try again later.',
  DATABASE_ERROR: 'A database error occurred. Please try again later.',
  SERVICE_UNAVAILABLE: 'Service is temporarily unavailable. Please try again later.',
  
  // Business Logic
  ALREADY_EXISTS: (resource: string) => `${resource} already exists`,
  CANNOT_DELETE: (resource: string, reason?: string) => 
    `Cannot delete ${resource}${reason ? `: ${reason}` : ''}`,
  INVALID_STATUS_TRANSITION: (from: string, to: string) => 
    `Cannot change status from ${from} to ${to}`,
  
  // File Upload
  FILE_TOO_LARGE: (maxSize: string) => `File size exceeds maximum allowed size of ${maxSize}`,
  INVALID_FILE_TYPE: (allowedTypes: string[]) => 
    `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`,
  UPLOAD_FAILED: 'File upload failed. Please try again.',
  
  // Billing
  PAYMENT_FAILED: 'Payment processing failed. Please check your payment method.',
  INVOICE_ALREADY_PAID: 'This invoice has already been paid',
  INSUFFICIENT_CREDITS: 'Insufficient credits. Please purchase more credits.',
} as const;

// ============================================================================
// Success Messages
// ============================================================================

export const SUCCESS_MESSAGES = {
  CREATED: (resource: string) => `${resource} created successfully`,
  UPDATED: (resource: string) => `${resource} updated successfully`,
  DELETED: (resource: string) => `${resource} deleted successfully`,
  SAVED: 'Changes saved successfully',
  SENT: 'Message sent successfully',
  UPLOADED: 'File uploaded successfully',
  PAYMENT_SUCCESS: 'Payment processed successfully',
} as const;





