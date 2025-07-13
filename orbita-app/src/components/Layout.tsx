import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

const Layout: React.FC = () => {
    return (
        <div className="App">
            <Header />
            <main>
                <Outlet />
            </main>
        </div>
    )
};

export default Layout;

