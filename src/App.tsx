import { useState, useEffect } from 'react';
import { 
  ConnectButton, 
  useCurrentAccount, 
  useSuiClientQuery, 
  useSignAndExecuteTransaction,
  useSuiClient 
} from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';

// 🌟 UPDATED: Your brand new, live Mainnet/Testnet IDs!
const PACKAGE_ID = "0x8903e76049f4bfaa64e83bd559fb1ff31e79ae319c59cfe02acfec3e1c95ba5a";
const MARKET_ID = "0x1e6ad6c71ac888393458cb1e60e74d6dc8252772cf15fb56438fea7677d5456f";
const FARM_TYPE = `${PACKAGE_ID}::farm::FarmAnimal`;
const ADMIN_CAP_TYPE = `${PACKAGE_ID}::farm::FarmAdminCap`;

export default function App() {
  const account = useCurrentAccount();
  const suiClient = useSuiClient() as any; 
  
  const { mutateAsync: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const [marketItems, setMarketItems] = useState<any[]>([]);

  // 1. GLOBAL ESCROW MARKET SCAN
  const loadMarketplace = async () => {
    try {
      const marketData = await suiClient.getObject({
        id: MARKET_ID,
        options: { showContent: true }
      });

      const listedIds = (marketData.data?.content as any).fields.listed_items;

      if (!listedIds || listedIds.length === 0) {
        setMarketItems([]);
        return;
      }

      const items = await suiClient.multiGetObjects({
        ids: listedIds,
        options: { showContent: true }
      });

      const activeListings = items.filter((item: any) => !item.error);
      setMarketItems(activeListings);
    } catch (err) {
      console.error("Global scan failed:", err);
    }
  };

  useEffect(() => {
    loadMarketplace();
  }, [account?.address]);

  // 2. PERSONAL INVENTORY SCAN (For Cows)
  const { data: inventory, isPending } = useSuiClientQuery(
    'getOwnedObjects',
    {
      owner: account?.address || '', 
      filter: { StructType: FARM_TYPE },
      options: { showContent: true },
    },
    { enabled: !!account }
  );

  // 3. ADMIN BADGE SCAN (Looks for the Master Key!)
  const { data: adminCaps } = useSuiClientQuery(
    'getOwnedObjects',
    {
      owner: account?.address || '',
      filter: { StructType: ADMIN_CAP_TYPE }
    },
    { enabled: !!account }
  );
  
  // If the wallet has at least 1 Admin Cap, this becomes TRUE
  const isAdmin = adminCaps?.data && adminCaps.data.length > 0;

  // 4. FREE TEST REMINT (Updated to match the new strict PRD rules!)
  const handleRemintFarmNFT = async () => {
    if (!account) return alert("Please connect your wallet!");

    const tx = new Transaction();
    const [paymentCoin] = tx.splitCoins(tx.gas, [tx.pure.u64(0)]);
    const dummyKapogianId = "0x0000000000000000000000000000000000000000000000000000000000000000";
    
    tx.moveCall({
      target: `${PACKAGE_ID}::farm::mint_farm_nft`,
      arguments: [
        paymentCoin,
        tx.object('0x6'), // NEW: The universal Sui Clock ID to stamp the Birth Certificate
        tx.pure.id(dummyKapogianId),
        tx.pure.u8(0), // STRICT PRD: 0 represents a Cow (u8 integer)
        tx.pure.string("Bessie the Phygital Cow"), 
        tx.pure.string("https://api.dicebear.com/7.x/bottts/svg?seed=Bessie&backgroundColor=c0aede"), 
        tx.pure.string("TAG-001"),
        tx.pure.u64(180) // NEW: Growth target days (e.g., 180 days to mature)
      ],
    });

    try {
      await signAndExecuteTransaction({ transaction: tx });
      alert("🌾 Successfully minted a free test cow!");
      window.location.reload(); 
    } catch (err) {
      console.error("Mint failed:", err);
    }
  };

  // 5. ESCROW LISTING LOGIC
  const handleListForSale = async (animalId: string) => {
    const priceInput = document.getElementById(`price-${animalId}`) as HTMLInputElement;
    const price = Number(priceInput?.value);

    if (!price || price <= 0) return alert("Please enter a valid SUI price!");

    const tx = new Transaction();
    const priceInMist = Math.floor(price * 1_000_000_000); 

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
      loadMarketplace(); 
    } catch (err) {
      console.error("Listing failed:", err);
    }
  };

  // 6. ESCROW BUY LOGIC
  const handleBuy = async (listing: any) => {
    if (!account) return alert("Please connect your wallet first!");

    const listingId = listing.data?.objectId;
    const priceInMist = listing.data?.content?.fields?.price;
    
    const tx = new Transaction();
    const [paymentCoin] = tx.splitCoins(tx.gas, [tx.pure.u64(priceInMist)]);

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
      loadMarketplace(); 
    } catch (err) {
      console.error("Purchase failed:", err);
      alert("Failed to buy. Make sure you have enough SUI!");
    }
  };

  // 7. CANCEL LISTING LOGIC
  const handleCancelListing = async (listing: any) => {
    const listingId = listing.data?.objectId;
    const tx = new Transaction();

    tx.moveCall({
      target: `${PACKAGE_ID}::farm::unlist_animal`,
      arguments: [tx.object(listingId)]
    });

    try {
      await signAndExecuteTransaction({ transaction: tx });
      alert("🛑 Listing canceled! The cow is back in your Barn.");
      loadMarketplace(); 
    } catch (err) {
      console.error("Cancel failed:", err);
      alert("Failed to cancel listing.");
    }
  };

  // --- UI THEME COLORS ---
  const colors = {
    background: '#f1f8e9', 
    woodDark: '#5d4037',   
    woodLight: '#8d6e63',  
    accentOrange: '#ff9800',
    cardBg: '#ffffff',
    textMain: '#3e2723'
  };

  return (
    <div style={{ padding: '20px', fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif', backgroundColor: colors.background, minHeight: '100vh', color: colors.textMain }}>
      
      {/* HEADER */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 25px', background: colors.woodDark, borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h1 style={{ margin: 0, color: '#fff', fontSize: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          🌾 Kapogian Farm Trading Post
        </h1>
        <ConnectButton />
      </nav>

      {/* 👑 SECRET ADMIN DASHBOARD (Now driven by blockchain ownership!) */}
      {isAdmin && (
        <div style={{ background: '#ffd54f', padding: '15px 25px', marginTop: '20px', borderRadius: '12px', color: '#3e2723', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <span>👑 Admin Mode Active: You hold the Farm Master Key.</span>
          <button 
            onClick={() => alert("The 70/30 Harvest Payout UI will go here!")} 
            style={{ background: '#3e2723', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            💸 Distribute Payouts
          </button>
        </div>
      )}

      {/* MY BARN SECTION */}
      <section style={{ marginTop: '30px', background: '#fff3e0', padding: '25px', borderRadius: '16px', boxShadow: 'inset 0 0 10px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, color: colors.woodDark, display: 'flex', alignItems: 'center', gap: '10px' }}>
            📦 My Barn
          </h2>
          {account && (
            <button 
              onClick={handleRemintFarmNFT} 
              style={{ background: '#4caf50', color: 'white', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', border: 'none', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.2)', transition: 'transform 0.1s' }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              ✨ Mint Test Cow (Free)
            </button>
          )}
        </div>

        {account ? (
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            {isPending && <p style={{ color: colors.woodLight }}>Scanning wallet...</p>}
            
            {inventory?.data.map((obj: any) => {
              const cowFields = obj.data?.content?.fields;
              const cowName = cowFields?.name || "Unnamed Cow";
              const cowImg = cowFields?.image_url || "https://api.dicebear.com/7.x/bottts/svg?seed=fallback";
              const currentWeight = Number(cowFields?.weight || 0);

              return (
                <div key={obj.data.objectId} style={{ background: colors.cardBg, width: '220px', padding: '15px', borderRadius: '16px', boxShadow: '0 4px 8px rgba(0,0,0,0.08)', border: `2px solid #e0e0e0`, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <img src={cowImg} alt="cow" style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '10px', backgroundColor: '#e8eaf6' }} />
                  <h4 style={{ margin: 0, fontSize: '18px', textAlign: 'center' }}>{cowName}</h4>
                  
                  {/* STATS DISPLAY ONLY */}
                  <div style={{ display: 'flex', justifyContent: 'space-around', fontSize: '12px', color: '#666', background: '#f5f5f5', padding: '5px', borderRadius: '6px' }}>
                    <span>⚖️ {currentWeight}kg</span>
                    <span>❤️ {cowFields?.health || "Healthy"}</span>
                    <span>🧬 G{cowFields?.generation || 0}</span>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '5px', marginTop: '10px' }}>
                    <input id={`price-${obj.data.objectId}`} type="number" placeholder="SUI Price" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ccc', outline: 'none' }} />
                    <button 
                      onClick={() => handleListForSale(obj.data.objectId)} 
                      style={{ background: colors.accentOrange, color: 'white', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer', border: 'none', fontWeight: 'bold' }}>
                      List
                    </button>
                  </div>
                </div>
              );
            })}
            {inventory?.data.length === 0 && <p style={{ color: colors.woodLight, fontStyle: 'italic' }}>Your barn is empty. Mint a test cow to get started!</p>}
          </div>
        ) : (
          <p style={{ color: colors.woodLight }}>Please connect your Sui wallet to view your Barn.</p>
        )}
      </section>

      <hr style={{ margin: '40px 0', border: 'none', borderTop: `2px dashed ${colors.woodLight}`, opacity: 0.3 }} />

      {/* GLOBAL MARKETPLACE SECTION */}
      <section style={{ padding: '0 10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
          <h2 style={{ margin: 0, color: colors.woodDark }}>🌎 Trading Post</h2>
          <button 
            onClick={loadMarketplace} 
            style={{ background: 'transparent', color: colors.woodDark, padding: '8px 15px', cursor: 'pointer', border: `2px solid ${colors.woodDark}`, borderRadius: '8px', fontWeight: 'bold' }}>
            🔄 Refresh Market
          </button>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '25px' }}>
          {marketItems.map((listing) => {
            const cow = listing.data?.content?.fields?.item?.fields;
            const priceSui = Number(listing.data?.content?.fields?.price) / 1_000_000_000;
            const seller = listing.data?.content?.fields?.seller;
            const cowImg = cow?.image_url || "https://api.dicebear.com/7.x/bottts/svg?seed=fallback";

            return (
              <div key={listing.data?.objectId} style={{ background: colors.cardBg, padding: '20px', borderRadius: '16px', textAlign: 'center', boxShadow: '0 6px 16px rgba(0,0,0,0.06)', border: `1px solid #eee`, transition: 'transform 0.2s' }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <img src={cowImg} alt="cow" style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '50%', backgroundColor: '#f3e5f5', border: `4px solid ${colors.woodLight}`, marginBottom: '15px' }} />
                
                <h3 style={{ margin: '0 0 5px 0', fontSize: '20px' }}>{cow?.name || "Bessie"}</h3>
                <p style={{ margin: '0 0 15px 0', color: '#666', fontSize: '14px' }}>
                  <span style={{ fontWeight: 'bold', color: '#4caf50' }}>{priceSui} SUI</span> • Gen {cow?.generation || 0}
                </p>
                
                {account?.address === seller ? (
                  <button 
                    onClick={() => handleCancelListing(listing)} 
                    style={{ width: '100%', background: '#f44336', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', boxShadow: '0 2px 4px rgba(244, 67, 54, 0.3)' }}>
                    ❌ Cancel Listing
                  </button>
                ) : (
                  <button 
                    onClick={() => handleBuy(listing)} 
                    style={{ width: '100%', background: '#2196f3', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px', boxShadow: '0 2px 4px rgba(33, 150, 243, 0.3)' }}>
                    💰 Buy Now
                  </button>
                )}
              </div>
            );
          })}
          {marketItems.length === 0 && <p style={{ color: colors.woodLight, gridColumn: '1 / -1', textAlign: 'center', padding: '40px 0' }}>The market is currently empty. Check back later!</p>}
        </div>
      </section>
    </div>
  );
}