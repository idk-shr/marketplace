import { useMarketplace } from './hooks/useMarketplace';
import Header from './components/ui/Header';
import AdminPanel from './components/ui/AdminPanel';
import Barn from './components/features/Barn';
import Marketplace from './components/features/Marketplace';

export default function App() {
  const { 
    marketItems, 
    inventory, 
    isAdmin, 
    loading, 
    loadMarketplace, 
    loadInventory 
  } = useMarketplace();

  const colors = {
    background: '#f1f8e9',
    textMain: '#3e2723'
  };

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif', 
      backgroundColor: colors.background, 
      minHeight: '100vh', 
      color: colors.textMain 
    }}>
      <Header isAdmin={isAdmin} />

      {isAdmin && <AdminPanel />}

      <Barn 
        inventory={inventory}
        loading={loading}
        onMintSuccess={() => {
          loadInventory();
          loadMarketplace();
        }}
        onListSuccess={loadMarketplace}
      />

      <hr style={{ 
        margin: '40px 0', 
        border: 'none', 
        borderTop: '2px dashed #8d6e63', 
        opacity: 0.3 
      }} />

      <Marketplace 
        marketItems={marketItems}
        loading={loading}
        onRefresh={loadMarketplace}
        onTransactionSuccess={() => {
          loadMarketplace();
          loadInventory();
        }}
      />
    </div>
  );
}