// app/Components/TabCard.tsx
import React from 'react';
import Link from 'next/link';
import { Tab as TabType } from '../createTab/useTabs';

interface TabCardProps {
  tab: TabType;
  onView: (tab: TabType) => void;
  onDelete?: (id: number) => void;
}

const TabCard: React.FC<TabCardProps> = ({ tab, onView, onDelete }) => {
  return (
    <div className="border p-4 rounded bg-white">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">{tab.icon}</span>
        <h3 className="text-lg font-semibold">{tab.name}</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-1">{tab.category}</p>
      <p className="text-xs text-muted-foreground mb-3">{tab.date}</p>
      <div className="flex gap-2">
        <a
          href={tab.url}
          target="_blank"
          rel="noreferrer"
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
        >
          Open
        </a>
        <Link
          href={`/tabs/${tab.id}`}
          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
        >
          Details
        </Link>
        {tab.content && (
          <button
            onClick={() => onView(tab)}
            className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
          >
            View HTML
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(tab.id)}
            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default TabCard;
