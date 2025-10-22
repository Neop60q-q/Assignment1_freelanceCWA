'use client'
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../Components/navBar';
import { useTabs } from './useTabs';

const CreateTab = () => {
    // Variables
    const [tabName, setTabName] = useState('');
    const [tabUrl, setTabUrl] = useState('');
    const [tabIcon, setTabIcon] = useState('');
    const [tabCategory, setTabCategory] = useState('');
    
    // Use the shared hook
    const { addTab } = useTabs();

    const handleAddTab = () => {
        const newTab = {
            name: tabName,
            url: tabUrl,
            icon: tabIcon.trim() === "" ? "🔗" : tabIcon,
            category: tabCategory
        };
        
        addTab(newTab);
        
        // Clear form
        setTabName('');
        setTabUrl('');
        setTabIcon('');
        setTabCategory('');
    };

    return (
        <div>
            <Navbar />
            <div className="container bg-light" 
                 style={{ marginTop: '5rem' }}>
                <div className="row">
                    <div className="col">
                        <input
                            type="text"
                            className="form-control mb-2"
                            placeholder="Tab Name"
                            value={tabName}
                            onChange={(e) => setTabName(e.target.value)}
                        />
                        <input
                            type="text"
                            className="form-control mb-2"
                            placeholder="Tab URL"
                            value={tabUrl}
                            onChange={(e) => setTabUrl(e.target.value)}
                        />
                        <input
                            type="text"
                            className="form-control mb-2"
                            placeholder="Tab Icon (emoji or text)"
                            value={tabIcon}
                            onChange={(e) => setTabIcon(e.target.value)}
                        />
                        <input
                            type="text"
                            className="form-control mb-2"
                            placeholder="Tab Category"
                            value={tabCategory}
                            onChange={(e) => setTabCategory(e.target.value)}
                        />
                        <button onClick={handleAddTab} 
                                className="btn btn-primary mb-2">
                            Add Tab
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateTab;