import { API_BASE_URL, STORAGE_KEYS } from "@/lib/constants";
import { simulateNetworkFailure } from "@/lib/utils";

export enum API_ERROR_CODES {
  NETWORK_ERROR = "NETWORK_ERROR",
  SIMULATED_NETWORK_ERROR = "SIMULATED_NETWORK_ERROR",
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: API_ERROR_CODES
  ) {
    super(message);
    this.name = "ApiError";
    this.code = code;
  }
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async fetchWithTimeout(
    input: RequestInfo,
    init?: RequestInit,
    timeout = 5000
  ): Promise<Response> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(input, {
        ...init,
        signal: controller.signal,
      });
      return response;
    } catch (err: unknown) {
      const error = err as Error;
      if (error.name === "AbortError") {
        throw new ApiError(
          "Network request failed",
          0,
          API_ERROR_CODES.NETWORK_ERROR
        );
      }
      if (error instanceof TypeError) {
        throw new ApiError(
          "Network request failed",
          0,
          API_ERROR_CODES.NETWORK_ERROR
        );
      }
      throw error;
    } finally {
      clearTimeout(id);
    }
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // Ignore JSON parsing errors
      }
      throw new ApiError(errorMessage, response.status);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return response.json();
    }
    return response.text() as T;
  }

  async get<T>(endpoint: string): Promise<T> {
    try {
      const response = await this.fetchWithTimeout(
        `${this.baseURL}${endpoint}`,
        {
          method: "GET",
          headers: this.getAuthHeaders(),
        }
      );
      return this.handleResponse<T>(response);
    } catch (err: unknown) {
      const error = err as Error;
      if (error instanceof TypeError) {
        throw new ApiError(
          "Network request failed",
          0,
          API_ERROR_CODES.NETWORK_ERROR
        );
      }
      throw error;
    }
  }

  async post<T>(
    endpoint: string,
    data: unknown,
    isRetry: boolean = false
  ): Promise<T> {
    if (simulateNetworkFailure() && !isRetry) {
      throw new ApiError(
        "Your request failed. Please try again. (Simulated Failure)",
        500,
        API_ERROR_CODES.SIMULATED_NETWORK_ERROR
      );
    }

    try {
      const response = await this.fetchWithTimeout(
        `${this.baseURL}${endpoint}`,
        {
          method: "POST",
          headers: this.getAuthHeaders(),
          body: JSON.stringify(data),
        }
      );
      return this.handleResponse<T>(response);
    } catch (err: unknown) {
      const error = err as Error;
      if (error instanceof TypeError) {
        throw new ApiError(
          "Network request failed",
          0,
          API_ERROR_CODES.NETWORK_ERROR
        );
      }
      throw error;
    }
  }

  async patch<T>(
    endpoint: string,
    data: unknown,
    isRetry: boolean = false
  ): Promise<T> {
    if (simulateNetworkFailure() && !isRetry) {
      throw new ApiError(
        "Your request failed. Please try again. (Simulated Failure)",
        500,
        API_ERROR_CODES.SIMULATED_NETWORK_ERROR
      );
    }

    try {
      const response = await this.fetchWithTimeout(
        `${this.baseURL}${endpoint}`,
        {
          method: "PATCH",
          headers: this.getAuthHeaders(),
          body: JSON.stringify(data),
        }
      );
      return this.handleResponse<T>(response);
    } catch (err: unknown) {
      const error = err as Error;
      if (error instanceof TypeError) {
        throw new ApiError(
          "Network request failed",
          0,
          API_ERROR_CODES.NETWORK_ERROR
        );
      }
      throw error;
    }
  }

  async delete<T>(endpoint: string): Promise<T> {
    try {
      const response = await this.fetchWithTimeout(
        `${this.baseURL}${endpoint}`,
        {
          method: "DELETE",
          headers: this.getAuthHeaders(),
        }
      );
      return this.handleResponse<T>(response);
    } catch (err: unknown) {
      const error = err as Error;
      if (error instanceof TypeError) {
        throw new ApiError(
          "Network request failed",
          0,
          API_ERROR_CODES.NETWORK_ERROR
        );
      }
      throw error;
    }
  }
}

export const apiClient = new ApiClient();
