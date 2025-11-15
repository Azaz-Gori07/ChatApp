/**
 * Extract clean message from API error
 */

export const apiErrorHandler = (error) => {
  if (!error) return "Unknown error";

  // Axios error with response message
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  // Axios error object message
  if (error.message) {
    return error.message;
  }

  return "Something went wrong";
};
