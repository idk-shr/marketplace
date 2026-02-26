import { useCurrentAccount } from '@mysten/dapp-kit';
import { useTransactions } from '../../hooks/useTransactions';
import type { FarmAnimal } from '../../types';

interface BarnProps {
  inventory: FarmAnimal[];
  loading: boolean;
  onMintSuccess?: () => void;
  onListSuccess?: () => void;
}

const Barn = ({ inventory, loading, onMintSuccess, onListSuccess }: BarnProps) => {
  const account = useCurrentAccount();
  const { mintFarmNFT, listForSale } = useTransactions();

  const handleMint = async () => {
    try {
      await mintFarmNFT();
      alert("🌾 Successfully minted a free test cow!");
      onMintSuccess?.();
    } catch (err) {
      console.error("Mint failed:", err);
      alert("Failed to mint cow. Please try again.");
    }
  };

  const handleListForSale = async (animalId: string) => {
    const priceInput = document.getElementById(`price-${animalId}`) as HTMLInputElement;
    const price = Number(priceInput?.value);

    if (!price || price <= 0) return alert("Please enter a valid SUI price!");

    try {
      await listForSale(animalId, price);
      alert("🚜 Success! Cow placed in Escrow Market.");
      onListSuccess?.();
    } catch (err) {
      console.error("Listing failed:", err);
      alert("Failed to list cow. Please try again.");
    }
  };

  const colors = {
    woodDark: '#5d4037',
    woodLight: '#8d6e63',
    cardBg: '#ffffff'
  };

  return (
    <section style={{ 
      marginTop: '30px', 
      background: '#fff3e0', 
      padding: '25px', 
      borderRadius: '16px', 
      boxShadow: 'inset 0 0 10px rgba(0,0,0,0.05)' 
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        marginBottom: '20px' 
      }}>
        <h2 style={{ 
          margin: 0, 
          color: colors.woodDark, 
          display: 'flex', 
          alignItems: 'center', 
          gap: '10px' 
        }}>
          📦 My Barn
        </h2>
        {account && (
          <button 
            onClick={handleMint} 
            style={{ 
              background: '#4caf50', 
              color: 'white', 
              padding: '10px 20px', 
              borderRadius: '8px', 
              cursor: 'pointer', 
              border: 'none', 
              fontWeight: 'bold', 
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)', 
              transition: 'transform 0.1s' 
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            ✨ Mint Test Cow (Free)
          </button>
        )}
      </div>

      {account ? (
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          {loading && <p style={{ color: colors.woodLight }}>Scanning wallet...</p>}
          
          {inventory.map((obj: any) => {
            const cowFields = obj.data?.content?.fields;
            const cowName = cowFields?.name || "Unnamed Cow";
            const cowImg = cowFields?.image_url || "https://api.dicebear.com/7.x/bottts/svg?seed=fallback";
            const currentWeight = Number(cowFields?.weight || 0);

            return (
              <div key={obj.data.objectId} style={{ 
                background: colors.cardBg, 
                width: '220px', 
                padding: '15px', 
                borderRadius: '16px', 
                boxShadow: '0 4px 8px rgba(0,0,0,0.08)', 
                border: `2px solid #e0e0e0`, 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '10px' 
              }}>
                <img 
                  src={cowImg} 
                  alt="cow" 
                  style={{ 
                    width: '100%', 
                    height: '150px', 
                    objectFit: 'cover', 
                    borderRadius: '10px', 
                    backgroundColor: '#e8eaf6' 
                  }} 
                />
                <h4 style={{ margin: 0, fontSize: '18px', textAlign: 'center' }}>{cowName}</h4>
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-around', 
                  fontSize: '12px', 
                  color: '#666', 
                  background: '#f5f5f5', 
                  padding: '5px', 
                  borderRadius: '6px' 
                }}>
                  <span>⚖️ {currentWeight}kg</span>
                  <span>❤️ {cowFields?.health || "Healthy"}</span>
                  <span>🧬 G{cowFields?.generation || 0}</span>
                </div>
                
                <div style={{ display: 'flex', gap: '5px', marginTop: '10px' }}>
                  <input 
                    id={`price-${obj.data.objectId}`} 
                    type="number" 
                    placeholder="SUI Price" 
                    style={{ 
                      width: '100%', 
                      padding: '8px', 
                      borderRadius: '6px', 
                      border: '1px solid #ccc', 
                      outline: 'none' 
                    }} 
                  />
                  <button 
                    onClick={() => handleListForSale(obj.data.objectId)} 
                    style={{ 
                      background: '#ff9800', 
                      color: 'white', 
                      padding: '8px 15px', 
                      borderRadius: '6px', 
                      cursor: 'pointer', 
                      border: 'none', 
                      fontWeight: 'bold' 
                    }}
                  >
                    List
                  </button>
                </div>
              </div>
            );
          })}
          {inventory.length === 0 && <p style={{ color: colors.woodLight, fontStyle: 'italic' }}>Your barn is empty. Mint a test cow to get started!</p>}
        </div>
      ) : (
        <p style={{ color: colors.woodLight }}>Please connect your Sui wallet to view your Barn.</p>
      )}
    </section>
  );
};

export default Barn;
