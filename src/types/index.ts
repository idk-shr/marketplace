// 🌟 UPDATED: Your brand new, live Mainnet/Testnet IDs!
export const PACKAGE_ID = "0x8903e76049f4bfaa64e83bd559fb1ff31e79ae319c59cfe02acfec3e1c95ba5a";
export const MARKET_ID = "0x1e6ad6c71ac888393458cb1e60e74d6dc8252772cf15fb56438fea7677d5456f";
export const FARM_TYPE = `${PACKAGE_ID}::farm::FarmAnimal`;
export const ADMIN_CAP_TYPE = `${PACKAGE_ID}::farm::FarmAdminCap`;

export interface FarmAnimal {
  objectId: string;
  name: string;
  image_url: string;
  weight: number;
  health: string;
  generation: number;
  tag: string;
}

export interface MarketListing {
  data: {
    objectId: string;
    content: {
      fields: {
        price: string;
        seller: string;
        item: {
          fields: FarmAnimal;
        };
      };
    };
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface MintRequest {
  kapogianId?: string;
}

export interface ListRequest {
  animalId: string;
  priceInSui: number;
}

export interface BuyRequest {
  listingId: string;
  priceInMist: string;
}

export interface CancelRequest {
  listingId: string;
}
