# Kapogian Farm Marketplace - Separated Architecture

This project has been restructured into a clean separation between frontend and backend components.

## 📁 Project Structure

```
marketplace/
├── backend/                    # Node.js API server
│   ├── src/
│   │   ├── config/
│   │   │   └── constants.js   # Blockchain constants and network config
│   │   ├── middleware/
│   │   │   └── cors.js        # CORS configuration
│   │   ├── routes/
│   │   │   └── marketplace.js # API endpoints
│   │   ├── services/
│   │   │   └── suiService.js  # Sui blockchain interactions
│   │   └── index.js           # Server entry point
│   └── package.json           # Backend dependencies
├── src/                       # React frontend
│   ├── components/
│   │   ├── ui/               # Reusable UI components
│   │   │   ├── Header.tsx
│   │   │   └── AdminPanel.tsx
│   │   └── features/         # Feature-specific components
│   │       ├── Barn.tsx
│   │       └── Marketplace.tsx
│   ├── hooks/                # Custom React hooks
│   │   ├── useMarketplace.ts
│   │   └── useTransactions.ts
│   ├── services/             # API service layer
│   │   └── api.ts
│   ├── types/                # TypeScript type definitions
│   │   └── index.ts
│   ├── App.tsx              # Main app component
│   └── main.tsx             # App entry point
└── package.json             # Frontend dependencies
```

## 🚀 Getting Started

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:3001`

### Frontend Setup

1. From the root directory, install frontend dependencies:
```bash
npm install
```

2. Start the frontend development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 📡 API Endpoints

### Marketplace Operations
- `GET /api/marketplace` - Get all marketplace listings
- `GET /api/marketplace/inventory/:address` - Get user's inventory
- `GET /api/marketplace/admin/:address` - Check admin status

### Transaction Operations
- `POST /api/marketplace/mint` - Create mint transaction
- `POST /api/marketplace/list` - Create listing transaction
- `POST /api/marketplace/buy` - Create buy transaction
- `POST /api/marketplace/cancel` - Create cancel transaction

## 🏗️ Architecture Benefits

### Frontend (React)
- **Component-based**: Separated UI components and feature components
- **Custom hooks**: Encapsulated business logic with `useMarketplace` and `useTransactions`
- **TypeScript**: Full type safety with defined interfaces
- **Service layer**: Clean API communication through `apiService`

### Backend (Node.js/Express)
- **RESTful API**: Clean endpoint structure
- **Service layer**: Sui blockchain interactions separated from routes
- **Middleware**: Proper CORS and security handling
- **Configuration**: Centralized constants and network settings

### Separation of Concerns
- **Frontend**: UI/UX, user interactions, wallet connections
- **Backend**: Blockchain operations, data fetching, transaction creation
- **API Communication**: Clean HTTP interface between frontend and backend

## 🔧 Key Features Separated

### Before (Monolithic)
- All logic mixed in single `App.tsx` file
- Direct blockchain calls from components
- No clear separation of concerns

### After (Separated)
- **UI Components**: Pure presentation logic
- **Feature Components**: Business logic for specific features
- **Hooks**: Reusable state and logic
- **Services**: External API communication
- **Backend API**: Blockchain operations and data fetching

## 🎯 Next Steps

1. **Transaction Execution**: Complete the transaction execution flow between frontend and backend
2. **Error Handling**: Implement comprehensive error handling
3. **Testing**: Add unit and integration tests
4. **Deployment**: Set up production deployment for both frontend and backend
5. **Caching**: Add caching layer for better performance
6. **WebSocket**: Real-time updates for marketplace changes

## 🐛 Known Issues

- Transaction execution needs to be completed (currently returns bytes directly)
- Some TypeScript warnings need to be addressed
- Error handling can be improved

## 📝 Development Notes

- The backend serves as a proxy to the Sui blockchain
- Frontend handles wallet connections and transaction signing
- All blockchain constants are centralized in the backend
- CORS is configured for local development
