import {useEffect, useState} from 'react';

const RECENTLY_USED_KEY = 'pharmacyhub-recently-used';
const MAX_RECENT_ITEMS = 5;

interface RecentItem {
  href: string;
  timestamp: number;
}

export function useRecentlyUsed() {
  const [recentItems, setRecentItems] = useState<RecentItem[]>([]);

  // Load recently used items from localStorage on mount
  useEffect(() => {
    const savedItems = localStorage.getItem(RECENTLY_USED_KEY);
    if (savedItems) {
      try {
        setRecentItems(JSON.parse(savedItems));
      } catch (error) {
        console.error('Error loading recently used items:', error);
        setRecentItems([]);
      }
    }
  }, []);

  const addRecentItem = (href: string) => {
    const now = Date.now();
    const newItems = [
      {href, timestamp: now},
      ...recentItems.filter(item => item.href !== href)
    ].slice(0, MAX_RECENT_ITEMS);

    setRecentItems(newItems);
    localStorage.setItem(RECENTLY_USED_KEY, JSON.stringify(newItems));
  };

  const clearRecentItems = () => {
    setRecentItems([]);
    localStorage.removeItem(RECENTLY_USED_KEY);
  };

  const formatTimestamp = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;

    // Less than a minute
    if (diff < 60000) {
      return 'Just now';
    }
    // Less than an hour
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `${minutes}m ago`;
    }
    // Less than a day
    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      return `${hours}h ago`;
    }
    // Less than a week
    if (diff < 604800000) {
      const days = Math.floor(diff / 86400000);
      return `${days}d ago`;
    }

    // More than a week, show date
    return new Date(timestamp).toLocaleDateString();
  };

  return {
    recentItems,
    addRecentItem,
    clearRecentItems,
    formatTimestamp
  };
}