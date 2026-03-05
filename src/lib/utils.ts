import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  value: number,
  currency = "USD",
  showCents = true
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: showCents ? 2 : 0,
    maximumFractionDigits: showCents ? 2 : 0,
  }).format(value);
}

/**
 * Action result type for server actions
 */
export type ActionResult<T = void> = {
  success: boolean;
  data?: T;
  error?: string;
  code?: ErrorCode;
  fields?: Record<string, string>;
};

export type ErrorCode = "NOT_FOUND" | "PERMISSION_DENIED" | "CONFLICT" | "DATABASE_ERROR" | "VALIDATION_ERROR" | "RATE_LIMITED" | "TIMEOUT" | "UNKNOWN_ERROR";

export const ERROR_CODES = {
  NOT_FOUND: "NOT_FOUND",
  PERMISSION_DENIED: "PERMISSION_DENIED",
  CONFLICT: "CONFLICT",
  DATABASE_ERROR: "DATABASE_ERROR",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  RATE_LIMITED: "RATE_LIMITED",
  TIMEOUT: "TIMEOUT",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
} as const satisfies Record<string, ErrorCode>;
