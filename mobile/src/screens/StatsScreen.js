import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Header from '../components/Header';
import Constants from 'expo-constants';
import { useGoals } from '../context/GoalsContext';
import { calculatePercent, formatCurrency } from '../utils';

const StatsScreen = () => {
    const { goals } = useGoals();

    const totalSaved = goals.reduce((sum, g) => sum + g.saved, 0);
    const totalGoal = goals.reduce((sum, g) => sum + g.target, 0);
    const totalPercent = calculatePercent(totalSaved, totalGoal);
    const completedGoals = goals.filter(g => g.saved >= g.target).length;

    return (
        <View style={styles.container}>
            <Header />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.pageTitle}>Stats Dashboard</Text>

                <View style={styles.mainStat}>
                    <Text style={styles.mainStatLabel}>Financial Freedom Score</Text>
                    <Text style={styles.mainStatValue}>{totalPercent}%</Text>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: `${totalPercent}%` }]} />
                    </View>
                </View>

                <View style={styles.grid}>
                    <View style={styles.statCard}>
                        <Text style={styles.statIcon}>💰</Text>
                        <Text style={styles.statLabel}>Total Saved</Text>
                        <Text style={styles.statValue}>{formatCurrency(totalSaved)}</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statIcon}>🎯</Text>
                        <Text style={styles.statLabel}>Goals Set</Text>
                        <Text style={styles.statValue}>{goals.length}</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statIcon}>🏆</Text>
                        <Text style={styles.statLabel}>Completed</Text>
                        <Text style={styles.statValue}>{completedGoals}</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Text style={styles.statIcon}>⏳</Text>
                        <Text style={styles.statLabel}>Pending</Text>
                        <Text style={styles.statValue}>{goals.length - completedGoals}</Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Goal Breakdown</Text>
                {goals.length === 0 ? (
                    <Text style={styles.emptyText}>No goals data available.</Text>
                ) : (
                    goals.map(goal => {
                        const percent = calculatePercent(goal.saved, goal.target);
                        return (
                            <View key={goal.id} style={styles.goalRow}>
                                <View style={styles.goalInfo}>
                                    <Text style={styles.goalName}>{goal.name}</Text>
                                    <Text style={styles.goalPercent}>{percent}%</Text>
                                </View>
                                <View style={styles.miniProgress}>
                                    <View style={[styles.miniFill, { width: `${percent}%`, backgroundColor: percent >= 100 ? '#4caf50' : '#ff8c00' }]} />
                                </View>
                            </View>
                        );
                    })
                )}

            </ScrollView>
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
    pageTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 20,
    },
    mainStat: {
        backgroundColor: '#1a1a1a',
        borderRadius: 20,
        padding: 24,
        marginBottom: 24,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    mainStatLabel: {
        color: '#a0a0a0',
        fontSize: 16,
        marginBottom: 8,
    },
    mainStatValue: {
        color: '#ffd700',
        fontSize: 48,
        fontWeight: '800',
        marginBottom: 16,
    },
    progressBar: {
        width: '100%',
        height: 12,
        backgroundColor: '#333',
        borderRadius: 6,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#ffd700',
        borderRadius: 6,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    statCard: {
        width: '48%',
        backgroundColor: '#1f1f1f',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    statIcon: {
        fontSize: 32,
        marginBottom: 8,
    },
    statLabel: {
        color: '#a0a0a0',
        fontSize: 12,
        marginBottom: 4,
    },
    statValue: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '700',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#ffffff',
        marginBottom: 16,
    },
    goalRow: {
        marginBottom: 16,
    },
    goalInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    goalName: {
        color: '#ffffff',
        fontSize: 14,
    },
    goalPercent: {
        color: '#a0a0a0',
        fontSize: 14,
        fontWeight: '600',
    },
    miniProgress: {
        height: 6,
        backgroundColor: '#333',
        borderRadius: 3,
        overflow: 'hidden',
    },
    miniFill: {
        height: '100%',
        borderRadius: 3,
    },
    emptyText: {
        color: '#666',
        fontStyle: 'italic',
    },
});

export default StatsScreen;
