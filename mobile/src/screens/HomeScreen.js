import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useGoals } from '../context/GoalsContext';
import { useNotification } from '../context/NotificationContext';
import StatsCard from '../components/StatsCard';
import GoalCard from '../components/GoalCard';
import Header from '../components/Header';
import Constants from 'expo-constants';
import ConfirmationModal from '../components/ConfirmationModal';
import AddSavingsModal from '../components/AddSavingsModal';
// import GoalsPieChart from '../components/GoalsPieChart';

import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
    const { goals, deleteGoal, addSavingsToGoal } = useGoals();
    const { showNotification } = useNotification();
    const navigation = useNavigation();
    const [filter, setFilter] = useState('active'); // 'active' | 'completed'
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [goalToDelete, setGoalToDelete] = useState(null);
    const [addSavingsModalVisible, setAddSavingsModalVisible] = useState(false);
    const [goalToAddSavings, setGoalToAddSavings] = useState(null);

    console.log('HomeScreen render. Goals:', goals);

    if (!Array.isArray(goals)) {
        console.error('Goals is not an array:', goals);
        return <Text style={{ color: 'white', padding: 50 }}>Error: Goals data corrupted</Text>;
    }

    const totalSaved = goals.reduce((sum, g) => sum + g.saved, 0);
    const totalGoal = goals.reduce((sum, g) => sum + g.target, 0);

    const getFilteredGoals = () => {
        let filtered = goals.filter(g => {
            // Ensure we compare numbers, not strings
            const saved = parseFloat(g.saved) || 0;
            const target = parseFloat(g.target) || 1;
            const isCompleted = saved >= target;
            return filter === 'active' ? !isCompleted : isCompleted;
        });

        // Default sort by recent (ID descending)
        return filtered.sort((a, b) => b.id - a.id);
    };

    const handleDeletePress = (id) => {
        setGoalToDelete(id);
        setDeleteModalVisible(true);
    };

    const confirmDelete = () => {
        if (goalToDelete) {
            deleteGoal(goalToDelete);
            setGoalToDelete(null);
        }
        setDeleteModalVisible(false);
    };

    const handleAddSavingsPress = (goal) => {
        setGoalToAddSavings(goal);
        setAddSavingsModalVisible(true);
    };

    const confirmAddSavings = (amount) => {
        if (goalToAddSavings && amount > 0) {
            const remaining = goalToAddSavings.target - goalToAddSavings.saved;
            if (amount > remaining) {
                alert(`Amount exceeds remaining target. You only need ₱${remaining} more.`);
                return; // Do not close modal, let user correct
            }

            const updated = addSavingsToGoal(goalToAddSavings.id, amount);
            if (updated.saved >= updated.target) {
                showNotification(`🎉 Goal Reached: ${updated.name}!`);
            } else {
                showNotification(`Added ₱${amount} to ${updated.name}`);
            }
            setAddSavingsModalVisible(false);
            setGoalToAddSavings(null);
        }
    };

    const visibleGoals = getFilteredGoals();

    return (
        <View style={styles.container}>
            {/* Spacer for Status Bar if safe area requires it, though SafeAreaView handles it mostly */}
            <Header />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <StatsCard totalSaved={totalSaved} totalGoal={totalGoal} goals={goals} />

                {/* {goals.some(g => g.saved > 0) && <GoalsPieChart goals={goals} />} */}

                {/* Hero Section */}
                <View style={styles.heroSection}>
                    <Text style={styles.heroTitle}>Ignite Your</Text>
                    <Text style={styles.heroTitleGradient}>Savings Potential</Text>
                    <Text style={styles.heroSubtitle}>
                        Track your goals with energy. The premium way to save for your future.
                    </Text>
                </View>

                {/* Filter Tabs */}
                <View style={styles.filterContainer}>
                    <TouchableOpacity
                        style={[styles.filterTab, filter === 'active' && styles.filterTabActive]}
                        onPress={() => setFilter('active')}
                    >
                        <Text style={[styles.filterText, filter === 'active' && styles.filterTextActive]}>Active</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterTab, filter === 'completed' && styles.filterTabActive]}
                        onPress={() => setFilter('completed')}
                    >
                        <Text style={[styles.filterText, filter === 'completed' && styles.filterTextActive]}>Completed</Text>
                    </TouchableOpacity>
                </View>

                {/* Goals List */}
                <View style={styles.goalsSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.goalsSectionTitle}>
                            {filter === 'active' ? 'Active Goals' : 'Completed Goals'}
                        </Text>
                    </View>

                    {visibleGoals.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyIcon}>🎯</Text>
                            <Text style={styles.emptyText}>
                                {filter === 'active'
                                    ? "No active goals. Add your first savings goal!"
                                    : "No completed goals yet. Keep saving!"}
                            </Text>
                        </View>
                    ) : (
                        visibleGoals.map((goal) => (
                            <GoalCard
                                key={goal.id}
                                goal={goal}
                                onDelete={handleDeletePress}
                                onEdit={(goal) => navigation.navigate('EditGoal', { goal })}
                                onAddSavings={handleAddSavingsPress}
                            />
                        ))
                    )}
                </View>
            </ScrollView>

            <ConfirmationModal
                visible={deleteModalVisible}
                onClose={() => setDeleteModalVisible(false)}
                onConfirm={confirmDelete}
                title="Delete Goal"
                message="Are you sure you want to delete this goal? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
            />

            <AddSavingsModal
                visible={addSavingsModalVisible}
                onClose={() => setAddSavingsModalVisible(false)}
                onConfirm={confirmAddSavings}
                goalName={goalToAddSavings?.name}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0d0d0d',
        paddingHorizontal: 20,
        paddingTop: Constants.statusBarHeight + 10,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    heroSection: {
        marginBottom: 24,
    },
    heroTitle: {
        fontSize: 32,
        fontWeight: '800',
        color: '#ffffff',
        lineHeight: 38,
    },
    heroTitleGradient: {
        fontSize: 32,
        fontWeight: '800',
        color: '#ffd700',
        fontStyle: 'italic',
        marginBottom: 12,
    },
    heroSubtitle: {
        fontSize: 16,
        color: '#a0a0a0',
        lineHeight: 24,
    },
    goalsSection: {
        backgroundColor: '#f5f5f5',
        borderRadius: 20,
        padding: 24,
        marginBottom: 20,
    },
    goalsSectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1a1a1a',
        marginBottom: 20,
    },
    emptyState: {
        alignItems: 'center',
        padding: 32,
    },
    emptyIcon: {
        fontSize: 48,
        marginBottom: 16,
        opacity: 0.5,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    filterContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        backgroundColor: '#1f1f1f',
        borderRadius: 12,
        padding: 4,
    },
    filterTab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 10,
    },
    filterTabActive: {
        backgroundColor: '#333',
    },
    filterText: {
        color: '#888',
        fontWeight: '600',
    },
    filterTextActive: {
        color: '#fff',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
});

export default HomeScreen;
