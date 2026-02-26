import express from 'express';
import suiService from '../services/suiService.js';

const router = express.Router();

// GET /api/marketplace - Get all marketplace listings
router.get('/', async (req, res) => {
  try {
    const items = await suiService.loadMarketplace();
    res.json({ success: true, data: items });
  } catch (error) {
    console.error('Error fetching marketplace:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/marketplace/inventory/:address - Get user's inventory
router.get('/inventory/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const inventory = await suiService.getInventory(address);
    res.json({ success: true, data: inventory });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/marketplace/admin/:address - Check if user is admin
router.get('/admin/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const adminCaps = await suiService.getAdminCaps(address);
    const isAdmin = adminCaps?.data && adminCaps.data.length > 0;
    res.json({ success: true, isAdmin });
  } catch (error) {
    console.error('Error checking admin status:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/marketplace/mint - Create mint transaction
router.post('/mint', async (req, res) => {
  try {
    const { kapogianId } = req.body;
    const transaction = suiService.createMintTransaction(kapogianId);
    const transactionBytes = suiService.getTransactionBytes(transaction);
    res.json({ success: true, transactionBytes });
  } catch (error) {
    console.error('Error creating mint transaction:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/marketplace/list - Create listing transaction
router.post('/list', async (req, res) => {
  try {
    const { animalId, priceInSui } = req.body;
    
    if (!animalId || !priceInSui || priceInSui <= 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'Valid animalId and priceInSui are required' 
      });
    }

    const transaction = suiService.createListingTransaction(animalId, priceInSui);
    const transactionBytes = suiService.getTransactionBytes(transaction);
    res.json({ success: true, transactionBytes });
  } catch (error) {
    console.error('Error creating listing transaction:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/marketplace/buy - Create buy transaction
router.post('/buy', async (req, res) => {
  try {
    const { listingId, priceInMist } = req.body;
    
    if (!listingId || !priceInMist) {
      return res.status(400).json({ 
        success: false, 
        error: 'listingId and priceInMist are required' 
      });
    }

    const transaction = suiService.createBuyTransaction(listingId, priceInMist);
    const transactionBytes = suiService.getTransactionBytes(transaction);
    res.json({ success: true, transactionBytes });
  } catch (error) {
    console.error('Error creating buy transaction:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/marketplace/cancel - Create cancel listing transaction
router.post('/cancel', async (req, res) => {
  try {
    const { listingId } = req.body;
    
    if (!listingId) {
      return res.status(400).json({ 
        success: false, 
        error: 'listingId is required' 
      });
    }

    const transaction = suiService.createCancelListingTransaction(listingId);
    const transactionBytes = suiService.getTransactionBytes(transaction);
    res.json({ success: true, transactionBytes });
  } catch (error) {
    console.error('Error creating cancel transaction:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
