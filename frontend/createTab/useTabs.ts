import { useState, useEffect, useCallback } from 'react';

export type Tab = {
  id: number;
  name: string;
  category: string;
  date: string;
  icon: string;
  url: string;
  content?: string;
};

// Shape used when adding a new tab (id and date are generated)
export type NewTabInput = Omit<Tab, 'id' | 'date'>;

export const useTabs = () => {
  const [tabs, setTabs] = useState<Tab[]>([]);

  // Load tabs from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem('myTabs');
      const tabsFromStorage: Tab[] = raw ? JSON.parse(raw) : [];
      setTabs(Array.isArray(tabsFromStorage) ? tabsFromStorage : []);
    } catch {
      setTabs([]);
    }
  }, []);

  // Save tabs to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('myTabs', JSON.stringify(tabs));
    } catch {
      // no-op if storage fails
    }
  }, [tabs]);

  const addTab = useCallback((newTab: NewTabInput) => {
    setTabs(prevTabs => {
      const nextId = (prevTabs[prevTabs.length - 1]?.id ?? 0) + 1;
      const tabWithId: Tab = {
        ...newTab,
        id: nextId,
        date: new Date().toLocaleDateString(),
      };
      return [...prevTabs, tabWithId];
    });
  }, []);

  const removeTab = useCallback((id: number) => {
    setTabs(prevTabs => prevTabs.filter(t => t.id !== id));
  }, []);

  const viewTab = useCallback((tab: Tab) => {
    const newWindow = window.open('', '_blank');
    if (!newWindow) return;
    newWindow.document.write(tab.content ?? '');
    newWindow.document.close();
  }, []);

  const getTabById = useCallback((id: string | number): Tab | null => {
    const numericId = typeof id === 'string' ? Number(id) : id;
    if (Number.isNaN(numericId)) return null;
    return tabs.find(t => t.id === numericId) ?? null;
  }, [tabs]);

  return { tabs, addTab, removeTab, viewTab, getTabById };
}; 