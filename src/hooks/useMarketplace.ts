import { useState, useEffect } from 'react';
import { useCurrentAccount, useSuiClientQuery } from '@mysten/dapp-kit';
import apiService from '../services/api';
import type { MarketListing } from '../types';
import { PACKAGE_ID } from '../types';

export const useMarketplace = () => {
  const [marketItems, setMarketItems] = useState<MarketListing[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const account = useCurrentAccount();

  // Load marketplace data from backend
  const loadMarketplace = async () => {
    try {
      setLoading(true);
      const response = await apiService.getMarketplace();
      if (response.success && response.data) {
        setMarketItems(response.data);
      }
    } catch (error) {
      console.error('Failed to load marketplace:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load user inventory using direct Sui query (keeping original approach)
  const { data: inventoryData, isPending: inventoryPending } = useSuiClientQuery(
    'getOwnedObjects',
    {
      owner: account?.address || '', 
      filter: { StructType: `${PACKAGE_ID}::farm::FarmAnimal` },
      options: { showContent: true },
    },
    { enabled: !!account }
  );

  // Check admin status using direct Sui query (keeping original approach)
  const { data: adminCaps } = useSuiClientQuery(
    'getOwnedObjects',
    {
      owner: account?.address || '',
      filter: { StructType: `${PACKAGE_ID}::farm::FarmAdminCap` }
    },
    { enabled: !!account }
  );

  // Update inventory when data changes
  useEffect(() => {
    if (inventoryData?.data) {
      setInventory(inventoryData.data);
    }
  }, [inventoryData]);

  // Update admin status when data changes
  useEffect(() => {
    setIsAdmin(!!(adminCaps?.data && adminCaps.data.length > 0));
  }, [adminCaps]);

  // Load marketplace data when account changes
  useEffect(() => {
    loadMarketplace();
  }, [account?.address]);

  return {
    marketItems,
    inventory,
    isAdmin,
    loading: loading || inventoryPending,
    loadMarketplace,
    loadInventory: () => {}, // Inventory is loaded via Sui query
    checkAdminStatus: () => {}, // Admin status is checked via Sui query
  };
};
