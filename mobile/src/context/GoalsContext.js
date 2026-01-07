import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const GoalsContext = createContext();

const STORAGE_KEY = '@sparksave_goals';

export const GoalsProvider = ({ children }) => {
    const [goals, setGoals] = useState([]);

    // Load goals from storage on mount
    useEffect(() => {
        loadGoals();
    }, []);

    // Save goals whenever they change
    useEffect(() => {
        // We only save if goals have been loaded to avoid overwriting with empty array on initial render if load is slow
        // But hooks run in order. loadGoals setGoals triggers re-render.
        // Better to explicitly save in add/delete or use a separate effect that checks a 'loaded' flag.
        // For simplicity of this migration, we'll keep it simple but add a check.
        if (goals.length > 0) {
            saveGoals();
        }
    }, [goals]);

    const loadGoals = async () => {
        try {
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            if (stored) {
                setGoals(JSON.parse(stored));
            } else {
                // Add sample goal for demo if empty
                const sampleGoals = [
                    {
                        id: Date.now(),
                        name: 'Emergency Fund',
                        target: 10000,
                        saved: 2500,
                        description: 'Saving for a rainy day',
                    },
                ];
                setGoals(sampleGoals);
            }
        } catch (error) {
            console.error('Error loading goals:', error);
        }
    };

    const saveGoals = async () => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
        } catch (error) {
            console.error('Error saving goals:', error);
        }
    };

    const addGoal = (newGoal) => {
        const updatedGoals = [...goals, newGoal];
        setGoals(updatedGoals);
        // Explicitly save here to ensure persistence even if effect is debounced/laggy
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedGoals));
    };

    const updateGoal = (updatedGoal) => {
        const updatedGoals = goals.map((g) => (g.id === updatedGoal.id ? updatedGoal : g));
        setGoals(updatedGoals);
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedGoals));
    };

    const deleteGoal = (id) => {
        const updatedGoals = goals.filter((g) => g.id !== id);
        setGoals(updatedGoals);
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedGoals));
    };

    const clearAllGoals = async () => {
        try {
            setGoals([]);
            await AsyncStorage.removeItem(STORAGE_KEY);
        } catch (error) {
            console.error('Error clearing goals:', error);
        }
    };

    const addSavingsToGoal = (id, amount) => {
        const updatedGoals = goals.map((g) => {
            if (g.id === id) {
                return { ...g, saved: g.saved + amount };
            }
            return g;
        });
        setGoals(updatedGoals);
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedGoals));
        return updatedGoals.find(g => g.id === id);
    };

    return (
        <GoalsContext.Provider value={{ goals, addGoal, updateGoal, deleteGoal, clearAllGoals, addSavingsToGoal }}>
            {children}
        </GoalsContext.Provider>
    );
};

export const useGoals = () => {
    const context = useContext(GoalsContext);
    if (!context) {
        throw new Error('useGoals must be used within a GoalsProvider');
    }
    return context;
};
