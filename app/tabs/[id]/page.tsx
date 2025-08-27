'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '../../Components/navBar';
import { useTabs } from '../../createTab/useTabs';

type Tab = {
  id: number;
  name: string;
  category: string;
  date: string;
  icon: string;
  url: string;
  content?: string;
};

export default function TabDetails() {
  const params = useParams();
  const id = params?.id as string;
  const { getTabById } = useTabs();
  const [tab, setTab] = useState<Tab | null>(null);

  useEffect(() => {
    if (!id) return;
    const found = getTabById(id);
    setTab(found);
  }, [id, getTabById]);

  if (!tab) return <div className="container" style={{ marginTop: '5rem' }}>Loading...</div>;

  return (
    <div>
      <Navbar />
      <div className="container bg-light" style={{ marginTop: '5rem' }}>
        <div className="card mt-5 p-4">
          <div className="flex items-center gap-2 mb-2"><span className="text-2xl">{tab.icon}</span><h1>{tab.name}</h1></div>
          <p className="text-muted mb-1">{tab.category}</p>
          <p className="text-muted mb-3">Created: {tab.date}</p>
          <a href={tab.url} target="_blank" rel="noreferrer" className="btn btn-primary mb-3">Open URL</a>
          {tab.content && (
            <div className="border p-3 bg-white">
              <h3 className="mb-2">HTML Content</h3>
              <pre className="overflow-auto"><code>{tab.content}</code></pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
