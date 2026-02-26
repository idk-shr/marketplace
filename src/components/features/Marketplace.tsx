import { useCurrentAccount } from '@mysten/dapp-kit';
import { useTransactions } from '../../hooks/useTransactions';
import type { MarketListing } from '../../types';

interface MarketplaceProps {
  marketItems: MarketListing[];
  loading: boolean;
  onRefresh: () => void;
  onTransactionSuccess: () => void;
}

const Marketplace = ({ marketItems, loading, onRefresh, onTransactionSuccess }: MarketplaceProps) => {
  const account = useCurrentAccount();
  const { buyAnimal, cancelListing } = useTransactions();

  const handleBuy = async (listing: any) => {
    if (!account) return alert("Please connect your wallet first!");

    const listingId = listing.data?.objectId;
    const priceInMist = listing.data?.content?.fields?.price;
    
    try {
      await buyAnimal(listingId, priceInMist);
      alert("🎉 Purchase successful! The smart contract has sent the cow to your Barn.");
      onTransactionSuccess();
    } catch (err) {
      console.error("Purchase failed:", err);
      alert("Failed to buy. Make sure you have enough SUI!");
    }
  };

  const handleCancelListing = async (listing: any) => {
    const listingId = listing.data?.objectId;
    
    try {
      await cancelListing(listingId);
      alert("🛑 Listing canceled! The cow is back in your Barn.");
      onTransactionSuccess();
    } catch (err) {
      console.error("Cancel failed:", err);
      alert("Failed to cancel listing.");
    }
  };

  const colors = {
    woodDark: '#5d4037',
    woodLight: '#8d6e63',
    cardBg: '#ffffff'
  };

  return (
    <section style={{ padding: '0 10px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '25px' 
      }}>
        <h2 style={{ margin: 0, color: colors.woodDark }}>🌎 Trading Post</h2>
        <button 
          onClick={onRefresh} 
          style={{ 
            background: 'transparent', 
            color: colors.woodDark, 
            padding: '8px 15px', 
            cursor: 'pointer', 
            border: `2px solid ${colors.woodDark}`, 
            borderRadius: '8px', 
            fontWeight: 'bold' 
          }}
        >
          🔄 Refresh Market
        </button>
      </div>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', 
        gap: '25px' 
      }}>
        {marketItems.map((listing) => {
          const cow = listing.data?.content?.fields?.item?.fields;
          const priceSui = Number(listing.data?.content?.fields?.price) / 1_000_000_000;
          const seller = listing.data?.content?.fields?.seller;
          const cowImg = cow?.image_url || "https://api.dicebear.com/7.x/bottts/svg?seed=fallback";

          return (
            <div key={listing.data?.objectId} style={{ 
              background: colors.cardBg, 
              padding: '20px', 
              borderRadius: '16px', 
              textAlign: 'center', 
              boxShadow: '0 6px 16px rgba(0,0,0,0.06)', 
              border: `1px solid #eee`, 
              transition: 'transform 0.2s' 
            }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <img 
                src={cowImg} 
                alt="cow" 
                style={{ 
                  width: '120px', 
                  height: '120px', 
                  objectFit: 'cover', 
                  borderRadius: '50%', 
                  backgroundColor: '#f3e5f5', 
                  border: `4px solid ${colors.woodLight}`, 
                  marginBottom: '15px' 
                }} 
              />
              
              <h3 style={{ margin: '0 0 5px 0', fontSize: '20px' }}>
                {cow?.name || "Bessie"}
              </h3>
              <p style={{ margin: '0 0 15px 0', color: '#666', fontSize: '14px' }}>
                <span style={{ fontWeight: 'bold', color: '#4caf50' }}>
                  {priceSui} SUI
                </span> • Gen {cow?.generation || 0}
              </p>
              
              {account?.address === seller ? (
                <button 
                  onClick={() => handleCancelListing(listing)} 
                  style={{ 
                    width: '100%', 
                    background: '#f44336', 
                    color: 'white', 
                    border: 'none', 
                    padding: '12px', 
                    borderRadius: '8px', 
                    fontWeight: 'bold', 
                    cursor: 'pointer', 
                    fontSize: '16px', 
                    boxShadow: '0 2px 4px rgba(244, 67, 54, 0.3)' 
                  }}
                >
                  ❌ Cancel Listing
                </button>
              ) : (
                <button 
                  onClick={() => handleBuy(listing)} 
                  style={{ 
                    width: '100%', 
                    background: '#2196f3', 
                    color: 'white', 
                    border: 'none', 
                    padding: '12px', 
                    borderRadius: '8px', 
                    fontWeight: 'bold', 
                    cursor: 'pointer', 
                    fontSize: '16px', 
                    boxShadow: '0 2px 4px rgba(33, 150, 243, 0.3)' 
                  }}
                >
                  💰 Buy Now
                </button>
              )}
            </div>
          );
        })}
        {marketItems.length === 0 && (
          <p style={{ 
            color: colors.woodLight, 
            gridColumn: '1 / -1', 
            textAlign: 'center', 
            padding: '40px 0' 
          }}>
            The market is currently empty. Check back later!
          </p>
        )}
      </div>
    </section>
  );
};

export default Marketplace;
