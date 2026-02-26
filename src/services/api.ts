import type { ApiResponse, FarmAnimal, MarketListing, MintRequest, ListRequest, BuyRequest, CancelRequest } from '../types';

const API_BASE_URL = 'http://localhost:3001/api/marketplace';

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Marketplace operations
  async getMarketplace(): Promise<ApiResponse<MarketListing[]>> {
    return this.request<MarketListing[]>('/');
  }

  async getInventory(address: string): Promise<ApiResponse<FarmAnimal[]>> {
    return this.request<FarmAnimal[]>(`/inventory/${address}`);
  }

  async checkAdmin(address: string): Promise<ApiResponse<{ isAdmin: boolean }>> {
    return this.request<{ isAdmin: boolean }>(`/admin/${address}`);
  }

  // Transaction operations
  async createMintTransaction(data: MintRequest): Promise<ApiResponse<{ transactionBytes: string }>> {
    return this.request<{ transactionBytes: string }>('/mint', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async createListingTransaction(data: ListRequest): Promise<ApiResponse<{ transactionBytes: string }>> {
    return this.request<{ transactionBytes: string }>('/list', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async createBuyTransaction(data: BuyRequest): Promise<ApiResponse<{ transactionBytes: string }>> {
    return this.request<{ transactionBytes: string }>('/buy', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async createCancelTransaction(data: CancelRequest): Promise<ApiResponse<{ transactionBytes: string }>> {
    return this.request<{ transactionBytes: string }>('/cancel', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export default new ApiService();
