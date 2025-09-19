// API Configuration
export const API_CONFIG = {
  // Set to 'mock' to use fake data, 'real' to use actual API
  mode: (process.env.NEXT_PUBLIC_API_MODE as "mock" | "real") || "mock",

  // Real API configuration
  real: {
    baseUrl:
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api",
    timeout: 10000,
    retries: 3,
    retryDelay: 1000,
  },

  // Mock API configuration
  mock: {
    // Mock data can be configured here if needed
    enableLogging: process.env.NODE_ENV === "development",
  },
};

// Helper function to check if we're using mock mode
export const isMockMode = () => API_CONFIG.mode === "mock";

// Helper function to get the appropriate base URL
export const getApiBaseUrl = () => {
  return isMockMode() ? "/api/mock" : API_CONFIG.real.baseUrl;
};
