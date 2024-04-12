// Interface to define the structure of the server health check response.
// Used in health check endpoints to provide a standardized response format.
export interface IHealthCheckResponse {
  status: string; // The status of the server (e.g., 'UP', 'DOWN').
  message: string; // A message providing additional details about the server's health.
}
