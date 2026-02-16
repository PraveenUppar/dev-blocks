import { toast } from "react-toastify";

/**
 * Handles API errors by displaying specific toast notifications.
 * Prioritizes Zod validation details (field-specific errors),
 * then falls back to AppError messages, and finally a default message.
 */
export const handleApiError = (error: any, defaultMessage: string = "Something went wrong") => {
  // 1. Zod Validation Errors (from backend validation middleware)
  if (error.response?.data?.details && Array.isArray(error.response.data.details)) {
    error.response.data.details.forEach((err: any) => {
      toast.error(`${err.field}: ${err.message}`);
    });
    return;
  }

  // 2. Custom AppError Message (e.g. "User not found", "Unauthorized")
  if (error.response?.data?.error?.message) {
    toast.error(error.response.data.error.message);
    return;
  }

  // 3. Fallback to default message
  toast.error(defaultMessage);
  console.error(defaultMessage, error);
};
