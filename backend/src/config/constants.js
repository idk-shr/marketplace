// 🌟 UPDATED: Your brand new, live Mainnet/Testnet IDs!
export const PACKAGE_ID = "0x8903e76049f4bfaa64e83bd559fb1ff31e79ae319c59cfe02acfec3e1c95ba5a";
export const MARKET_ID = "0x1e6ad6c71ac888393458cb1e60e74d6dc8252772cf15fb56438fea7677d5456f";
export const FARM_TYPE = `${PACKAGE_ID}::farm::FarmAnimal`;
export const ADMIN_CAP_TYPE = `${PACKAGE_ID}::farm::FarmAdminCap`;
export const SUI_CLOCK_ID = "0x6";

// Network configuration
export const NETWORK_CONFIG = {
  testnet: {
    url: "https://fullnode.testnet.sui.io:443",
    network: "testnet"
  },
  mainnet: {
    url: "https://fullnode.mainnet.sui.io:443", 
    network: "mainnet"
  }
};

export const DEFAULT_NETWORK = "testnet";
