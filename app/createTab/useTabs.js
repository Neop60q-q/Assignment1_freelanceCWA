import { useState, useEffect } from 'react';

export const useTabs = () => {
  const [tabs, setTabs] = useState([]);

  // Load tabs from localStorage on mount
  useEffect(() => {
    const tabsFromStorage = JSON.parse(localStorage.getItem('myTabs') ?? "[]");
    setTabs(tabsFromStorage);
  }, []);

  // Save tabs to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('myTabs', JSON.stringify(tabs));
  }, [tabs]);

  const addTab = (newTab) => {
    const tabWithId = {
      ...newTab,
      id: tabs.length + 1,
      date: new Date().toLocaleDateString()
    };
    setTabs(prev => [...prev, tabWithId]);
  };

  const viewTab = (tab) => {
    const newWindow = window.open('', '_blank');
    newWindow.document.write(tab.content);
    newWindow.document.close();
  };

  return { tabs, addTab, viewTab };
};