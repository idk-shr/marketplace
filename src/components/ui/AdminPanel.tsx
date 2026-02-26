interface AdminPanelProps {
  onDistributePayouts?: () => void;
}

const AdminPanel = ({ onDistributePayouts }: AdminPanelProps) => {
  return (
    <div style={{ 
      background: '#ffd54f', 
      padding: '15px 25px', 
      marginTop: '20px', 
      borderRadius: '12px', 
      color: '#3e2723', 
      fontWeight: 'bold', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)' 
    }}>
      <span>👑 Admin Mode Active: You hold the Farm Master Key.</span>
      <button 
        onClick={onDistributePayouts || (() => alert("The 70/30 Harvest Payout UI will go here!"))} 
        style={{ 
          background: '#3e2723', 
          color: 'white', 
          border: 'none', 
          padding: '10px 15px', 
          borderRadius: '8px', 
          cursor: 'pointer', 
          fontWeight: 'bold' 
        }}
      >
        💸 Distribute Payouts
      </button>
    </div>
  );
};

export default AdminPanel;
