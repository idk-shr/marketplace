import { SuiClient } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';
import { PACKAGE_ID, MARKET_ID, FARM_TYPE, ADMIN_CAP_TYPE, SUI_CLOCK_ID, NETWORK_CONFIG, DEFAULT_NETWORK } from '../config/constants.js';

class SuiService {
  constructor() {
    this.client = new SuiClient({ url: NETWORK_CONFIG[DEFAULT_NETWORK].url });
  }

  // 1. GLOBAL ESCROW MARKET SCAN
  async loadMarketplace() {
    try {
      const marketData = await this.client.getObject({
        id: MARKET_ID,
        options: { showContent: true }
      });

      const listedIds = (marketData.data?.content)?.fields?.listed_items;

      if (!listedIds || listedIds.length === 0) {
        return [];
      }

      const items = await this.client.multiGetObjects({
        ids: listedIds,
        options: { showContent: true }
      });

      return items.filter((item) => !item.error);
    } catch (err) {
      console.error("Global scan failed:", err);
      throw err;
    }
  }

  // 2. PERSONAL INVENTORY SCAN
  async getInventory(ownerAddress) {
    try {
      const inventory = await this.client.getOwnedObjects({
        owner: ownerAddress,
        filter: { StructType: FARM_TYPE },
        options: { showContent: true },
      });
      return inventory;
    } catch (err) {
      console.error("Inventory scan failed:", err);
      throw err;
    }
  }

  // 3. ADMIN BADGE SCAN
  async getAdminCaps(ownerAddress) {
    try {
      const adminCaps = await this.client.getOwnedObjects({
        owner: ownerAddress,
        filter: { StructType: ADMIN_CAP_TYPE }
      });
      return adminCaps;
    } catch (err) {
      console.error("Admin cap scan failed:", err);
      throw err;
    }
  }

  // 4. MINT FARM NFT TRANSACTION
  createMintTransaction(kapogianId = "0x0000000000000000000000000000000000000000000000000000000000000000") {
    const tx = new Transaction();
    const [paymentCoin] = tx.splitCoins(tx.gas, [tx.pure.u64(0)]);
    
    tx.moveCall({
      target: `${PACKAGE_ID}::farm::mint_farm_nft`,
      arguments: [
        paymentCoin,
        tx.object(SUI_CLOCK_ID),
        tx.pure.id(kapogianId),
        tx.pure.u8(0), // 0 represents a Cow
        tx.pure.string("Bessie the Phygital Cow"), 
        tx.pure.string("https://api.dicebear.com/7.x/bottts/svg?seed=Bessie&backgroundColor=c0aede"), 
        tx.pure.string("TAG-001"),
        tx.pure.u64(180) // Growth target days
      ],
    });

    return tx;
  }

  // 5. LIST FOR SALE TRANSACTION
  createListingTransaction(animalId, priceInSui) {
    const tx = new Transaction();
    const priceInMist = Math.floor(priceInSui * 1_000_000_000);

    tx.moveCall({
      target: `${PACKAGE_ID}::farm::list_animal`,
      arguments: [
        tx.object(MARKET_ID),
        tx.object(animalId),
        tx.pure.u64(priceInMist)
      ]
    });

    return tx;
  }

  // 6. BUY TRANSACTION
  createBuyTransaction(listingId, priceInMist) {
    const tx = new Transaction();
    const [paymentCoin] = tx.splitCoins(tx.gas, [tx.pure.u64(priceInMist)]);

    tx.moveCall({
      target: `${PACKAGE_ID}::farm::buy_animal`,
      arguments: [
        tx.object(listingId), 
        paymentCoin           
      ]
    });

    return tx;
  }

  // 7. CANCEL LISTING TRANSACTION
  createCancelListingTransaction(listingId) {
    const tx = new Transaction();

    tx.moveCall({
      target: `${PACKAGE_ID}::farm::unlist_animal`,
      arguments: [tx.object(listingId)]
    });

    return tx;
  }

  // Get transaction bytes for frontend signing
  getTransactionBytes(transaction) {
    return transaction.build({ client: this.client });
  }
}

export default new SuiService();
