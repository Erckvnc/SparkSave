import React, { createContext, useState, useContext, useCallback } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notification, setNotification] = useState({ message: '', visible: false });

    const showNotification = useCallback((message) => {
        setNotification({ message, visible: true });
        // Hide is handled by the Toast component or we can auto-hide here
        setTimeout(() => {
            setNotification((prev) => ({ ...prev, visible: false }));
        }, 3000);
    }, []);

    return (
        <NotificationContext.Provider value={{ notification, showNotification }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};
