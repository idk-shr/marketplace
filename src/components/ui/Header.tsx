import { ConnectButton } from '@mysten/dapp-kit';

interface HeaderProps {
  isAdmin?: boolean;
}

const Header = ({ isAdmin = false }: HeaderProps) => {
  return (
    <nav style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '15px 25px', 
      background: '#5d4037', 
      borderRadius: '12px', 
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)' 
    }}>
      <h1 style={{ 
        margin: 0, 
        color: '#fff', 
        fontSize: '24px', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '10px' 
      }}>
        🌾 Kapogian Farm Trading Post
      </h1>
      <ConnectButton />
    </nav>
  );
};

export default Header;
