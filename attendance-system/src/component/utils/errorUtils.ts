interface ErrorWithResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export function isErrorWithResponse(
  error: unknown
): error is ErrorWithResponse {
  return (
    typeof error === "object" &&
    error !== null &&
    ("response" in error || "message" in error)
  );
}
