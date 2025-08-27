// app/Components/TabCard.tsx
import React from 'react';

interface TabCardProps {
  tab: {
    id: number;
    name: string;
    icon: string;
    category: string;
    date: string;
    content?: string;
  };
  onView: (tab: any) => void;
}

const TabCard: React.FC<TabCardProps> = ({ tab, onView }) => {
  return (
    <div className="bg-card border border-border p-4 rounded">
      <div className="flex items-center mb-2">
        <span className="text-2xl mr-2">{tab.icon}</span>
        <h3 className="font-semibold">{tab.name}</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-2">{tab.category}</p>
      <p className="text-xs text-muted-foreground mb-3">Created: {tab.date}</p>
      <button 
        onClick={() => onView(tab)}
        className="w-full bg-primary text-primary-foreground py-2 px-4 hover:bg-primary/90 transition-colors"
      >
        View Tab
      </button>
    </div>
  );
};

export default TabCard;
