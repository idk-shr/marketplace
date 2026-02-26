import { useSignAndExecuteTransaction, useCurrentAccount } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { PACKAGE_ID, MARKET_ID } from '../types';

export const useTransactions = () => {
  const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const account = useCurrentAccount();

  const mintFarmNFT = async () => {
    if (!account) return alert("Please connect your wallet!");

    const tx = new Transaction();
    const [paymentCoin] = tx.splitCoins(tx.gas, [tx.pure.u64(0)]);
    const dummyKapogianId = "0x0000000000000000000000000000000000000000000000000000000000000000";
    
    tx.moveCall({
      target: `${PACKAGE_ID}::farm::mint_farm_nft`,
      arguments: [
        paymentCoin,
        tx.object('0x6'),
        tx.pure.id(dummyKapogianId),
        tx.pure.u8(0),
        tx.pure.string("Bessie the Phygital Cow"), 
        tx.pure.string("https://api.dicebear.com/7.x/bottts/svg?seed=Bessie&backgroundColor=c0aede"), 
        tx.pure.string("TAG-001"),
        tx.pure.u64(180)
      ],
    });

    try {
      await signAndExecuteTransaction({ transaction: tx });
      alert("🌾 Successfully minted a free test cow!");
      return true;
    } catch (err) {
      console.error("Mint failed:", err);
      throw err;
    }
  };

  const listForSale = async (animalId: string, priceInSui: number) => {
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

    try {
      await signAndExecuteTransaction({ transaction: tx });
      alert("🚜 Success! Cow placed in Escrow Market.");
      return true;
    } catch (err) {
      console.error("Listing failed:", err);
      throw err;
    }
  };

  const buyAnimal = async (listingId: string, priceInMist: string) => {
    const tx = new Transaction();
    const [paymentCoin] = tx.splitCoins(tx.gas, [tx.pure.u64(Number(priceInMist))]);

    tx.moveCall({
      target: `${PACKAGE_ID}::farm::buy_animal`,
      arguments: [
        tx.object(listingId), 
        paymentCoin           
      ]
    });

    try {
      await signAndExecuteTransaction({ transaction: tx });
      alert("🎉 Purchase successful! The smart contract has sent the cow to your Barn.");
      return true;
    } catch (err) {
      console.error("Purchase failed:", err);
      throw err;
    }
  };

  const cancelListing = async (listingId: string) => {
    const tx = new Transaction();

    tx.moveCall({
      target: `${PACKAGE_ID}::farm::unlist_animal`,
      arguments: [tx.object(listingId)]
    });

    try {
      await signAndExecuteTransaction({ transaction: tx });
      alert("🛑 Listing canceled! The cow is back in your Barn.");
      return true;
    } catch (err) {
      console.error("Cancel failed:", err);
      throw err;
    }
  };

  return {
    mintFarmNFT,
    listForSale,
    buyAnimal,
    cancelListing,
  };
};
